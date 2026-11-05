import { http } from 'msw'
import type { AdDraft, FilterState, SortKey } from '~/types'
import { findAd, publicAds, save, settleModeration, state, statusOf, toCard, toMyAd } from '../db'
import type { AdRecord } from '../fixtures/ads'
import { cities, districtsOf } from '../fixtures/geo'
import { filterAds, sortAds } from '../filtering'
import { approximateCenter, inPolygon } from '~/utils/geo'
import { currentUser, fail, json, list, noContent, notFound, paginate, simulate, unauthorized } from '../utils'

const favoritesOf = (request: Request) => {
  const user = currentUser(request)
  return user ? state.favorites[user.id] ?? [] : []
}

const parseFilter = (url: URL): Partial<FilterState> | undefined => {
  const raw = url.searchParams.get('f')
  if (!raw) return undefined
  try { return JSON.parse(raw) } catch { return undefined }
}

export function describe(section: string, data: Record<string, unknown>): string {
  const title = typeof data.title === 'string' && data.title ? data.title : 'Объявление'
  const extras: Record<string, string> = {
    work: 'Приглашаем к сотрудничеству. Своевременная оплата, понятные условия, дружная команда.',
    realty: 'Объект в хорошем районе, рядом транспорт, магазины и парк. Показ в удобное время.',
    goods: 'Состояние хорошее, всё работает. Возможен торг, самовывоз или доставка.',
    services: 'Работаю аккуратно и в срок, опыт более 5 лет. Выезжаю по городу, отвечаю быстро.'
  }
  return `${title}. ${extras[section] ?? extras.goods}`
}

/** Точка для показа: при скрытом адресе - сдвинутый центр приблизительной области, точная точка наружу не уходит */
const publicPoint = (a: AdRecord) => (a.coordinates && a.hideExactLocation ? approximateCenter(a.coordinates, a.id) : a.coordinates)

/** Объявление текущего пользователя или готовый ответ с ошибкой */
function own(request: Request, id: string): AdRecord | Response {
  const user = currentUser(request)
  if (!user) return unauthorized()
  const ad = state.created.find(a => a.id === id)
  if (!ad || statusOf(ad) === 'deleted') return notFound('Объявление')
  if (ad.authorId !== user.id) return fail(403, 'forbidden', 'Это чужое объявление')
  return ad
}

export const adsHandlers = (base: string) => [
  // Точки для карты (Договор, Прил. 1, п. 9): те же фильтры, что у списка, без пагинации; area - нарисованная граница «lng,lat;lng,lat;...»
  http.get(`${base}/ads/map`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const url = new URL(request.url)
    const filter = parseFilter(url)
    const area = (url.searchParams.get('area') ?? '').split(';').map((s) => {
      const [lng, lat] = s.split(',').map(Number)
      return { lat: lat!, lng: lng! }
    }).filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng))
    const found = sortAds(filterAds(publicAds(), { section: url.searchParams.get('section') ?? undefined, q: url.searchParams.get('q') ?? undefined, cityIds: list(url, 'city'), filter }), 'default')
    const favorites = favoritesOf(request)
    const points = found
      .filter(a => a.coordinates)
      .map(a => ({ ...toCard(a, favorites), coordinates: publicPoint(a)!, approximate: a.hideExactLocation || undefined }))
      .filter(p => area.length < 3 || inPolygon(p.coordinates, area))
    return json(points.slice(0, 2000))
  }),

  http.get(`${base}/ads/recommendations`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const url = new URL(request.url)
    const cityIds = list(url, 'city')
    const found = sortAds(filterAds(publicAds(), { cityIds }), 'default')
    const favorites = favoritesOf(request)
    const page = paginate(found, url)
    return json({ ...page, items: page.items.map(a => toCard(a, favorites)) })
  }),

  http.get(`${base}/ads`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const url = new URL(request.url)
    const filter = parseFilter(url)
    const found = sortAds(
      filterAds(publicAds(), { section: url.searchParams.get('section') ?? undefined, q: url.searchParams.get('q') ?? undefined, cityIds: list(url, 'city'), filter }),
      (url.searchParams.get('sort') ?? filter?.sort ?? 'default') as SortKey
    )
    const favorites = favoritesOf(request)
    const page = paginate(found, url)
    return json({ ...page, items: page.items.map(a => toCard(a, favorites)) })
  }),

  http.get(`${base}/me/ads`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const user = currentUser(request)
    if (!user) return unauthorized()
    settleModeration()
    return json(state.created.filter(a => a.authorId === user.id && statusOf(a) !== 'deleted').map(toMyAd))
  }),

  http.post(`${base}/ads/:id/hide`, async ({ request, params }) => {
    const err = await simulate(); if (err) return err
    const found = own(request, String(params.id)); if (found instanceof Response) return found
    if (statusOf(found) !== 'active') return fail(409, 'conflict', 'Снять можно только активное объявление')
    found.status = 'hidden'
    save()
    return json(toMyAd(found))
  }),

  http.post(`${base}/ads/:id/republish`, async ({ request, params }) => {
    const err = await simulate(); if (err) return err
    const found = own(request, String(params.id)); if (found instanceof Response) return found
    if (statusOf(found) !== 'hidden') return fail(409, 'conflict', 'Опубликовать снова можно только снятое объявление')
    found.status = 'active'
    found.expiresAt = new Date(Date.now() + 30 * 86_400_000).toISOString()
    save()
    return json(toMyAd(found))
  }),

  http.post(`${base}/ads/describe`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const { section, data } = (await request.json()) as { section: string, data: Record<string, unknown> }
    return json({ description: describe(section, data ?? {}) })
  }),

  http.get(`${base}/ads/:id`, async ({ params, request }) => {
    const err = await simulate(); if (err) return err
    settleModeration()
    const ad = findAd(String(params.id))
    // неактивное объявление видит только автор (предпросмотр и редактирование из кабинета)
    if (!ad || statusOf(ad) === 'deleted' || (statusOf(ad) !== 'active' && currentUser(request)?.id !== ad.authorId)) return notFound('Объявление')
    // служебные поля мока наружу не отдаём
    const { cityId: _c, districtId: _d, authorId: _a, distance: _dist, moderationSince: _m, holdModeration: _h, ...pub } = ad
    // скрытый адрес: точную точку видит только автор (для правки), остальные - центр приблизительной области
    const viewer = currentUser(request)
    const isAuthor = viewer?.id === ad.authorId
    const shown = ad.hideExactLocation && !isAuthor ? { ...pub, coordinates: publicPoint(ad) } : pub
    // гость контактов не получает вообще (не только скрывает в интерфейсе): сервер отдаёт только перечень способов связи
    if (!viewer) {
      const kinds = (['phone', 'telegram', 'whatsapp'] as const).filter(k => !!pub.contacts?.[k])
      return json({ ...shown, contacts: {}, contactsHidden: true, contactKinds: kinds })
    }
    return json(shown)
  }),

  http.post(`${base}/ads`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const user = currentUser(request)
    if (!user) return unauthorized()
    const draft = (await request.json()) as AdDraft
    const fields: Record<string, string> = {}
    if (!draft.title?.trim()) fields.title = 'Назовите объявление'
    if (!draft.price || !(draft.price.amount > 0)) fields.price = 'Укажите стоимость'
    if (!draft.contacts?.phone && !draft.contacts?.whatsapp && !draft.contacts?.telegram) fields.phone = 'Укажите хотя бы один контакт'
    if (Object.keys(fields).length) return fail(422, 'validation', 'Проверьте поля формы', fields)
    const city = cities.find(c => c.name === draft.city) ?? cities[0]!
    const district = districtsOf(city.id).find(d => d.name === draft.district)
    const id = `a${Date.now().toString(36)}`
    const record = {
      ...draft,
      id,
      number: 880_000_000 + state.created.length + 1,
      createdAt: new Date().toISOString(),
      image: draft.images?.[0],
      location: draft.address ?? draft.city,
      author: { id: user.id, name: user.name, online: true, since: user.createdAt },
      cityId: city.id,
      districtId: district?.id,
      authorId: user.id,
      distance: 10,
      // режим проверки «до публикации»: новое объявление ждёт модерации (в моке одобряется автоматически)
      status: 'moderation',
      moderationSince: Date.now(),
      views: 0
    } as AdRecord
    state.created.unshift(record)
    save()
    return json({ id }, 201)
  }),

  http.patch(`${base}/ads/:id`, async ({ request, params }) => {
    const err = await simulate(); if (err) return err
    const ad = own(request, String(params.id)); if (ad instanceof Response) return ad
    const patch = (await request.json()) as Partial<AdDraft>
    if (patch.title !== undefined && !patch.title.trim()) return fail(422, 'validation', 'Проверьте поля формы', { title: 'Назовите объявление' })
    // служебные поля правкой не меняются
    const { id: _i, status: _s, authorId: _a, ...rest } = patch as Record<string, unknown>
    Object.assign(ad, rest, { image: patch.images?.[0] ?? ad.image })
    // после правки активное и отклонённое объявление снова проходит модерацию
    if (statusOf(ad) === 'active' || statusOf(ad) === 'rejected') {
      ad.status = 'moderation'
      ad.rejectReason = undefined
      ad.holdModeration = false
      ad.moderationSince = Date.now()
    }
    save()
    return json(toMyAd(ad))
  }),

  http.delete(`${base}/ads/:id`, async ({ request, params }) => {
    const err = await simulate(); if (err) return err
    const ad = own(request, String(params.id)); if (ad instanceof Response) return ad
    // мягкое удаление: запись остаётся, из выдачи и кабинета исчезает
    ad.status = 'deleted'
    save()
    return noContent()
  }),

  http.post(`${base}/ads/:id/report`, async ({ params, request }) => {
    const err = await simulate(); if (err) return err
    if (!findAd(String(params.id))) return notFound('Объявление')
    const { reason } = (await request.json()) as { reason?: string }
    if (!reason) return fail(422, 'validation', 'Выберите причину', { reason: 'Выберите причину' })
    return noContent()
  })
]
