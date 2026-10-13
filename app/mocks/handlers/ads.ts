import { http } from 'msw'
import type { AdDraft, FilterState, SortKey } from '~/types'
import { allAds, findAd, save, state, toCard } from '../db'
import type { AdRecord } from '../fixtures/ads'
import { cities, districtsOf } from '../fixtures/geo'
import { filterAds, sortAds } from '../filtering'
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

export const adsHandlers = (base: string) => [
  http.get(`${base}/ads/recommendations`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const url = new URL(request.url)
    const cityIds = list(url, 'city')
    const found = sortAds(filterAds(allAds(), { cityIds }), 'default')
    const favorites = favoritesOf(request)
    const page = paginate(found, url)
    return json({ ...page, items: page.items.map(a => toCard(a, favorites)) })
  }),

  http.get(`${base}/ads`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const url = new URL(request.url)
    const filter = parseFilter(url)
    const found = sortAds(
      filterAds(allAds(), { section: url.searchParams.get('section') ?? undefined, q: url.searchParams.get('q') ?? undefined, cityIds: list(url, 'city'), filter }),
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
    return json(state.created.filter(a => a.authorId === user.id).map(a => toCard(a)))
  }),

  http.post(`${base}/ads/describe`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const { section, data } = (await request.json()) as { section: string, data: Record<string, unknown> }
    return json({ description: describe(section, data ?? {}) })
  }),

  http.get(`${base}/ads/:id`, async ({ params }) => {
    const err = await simulate(); if (err) return err
    const ad = findAd(String(params.id))
    if (!ad) return notFound('Объявление')
    // служебные поля мока наружу не отдаём
    const { cityId: _c, districtId: _d, authorId: _a, distance: _dist, ...pub } = ad
    return json(pub)
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
      distance: 10
    } as AdRecord
    state.created.unshift(record)
    save()
    return json({ id }, 201)
  }),

  http.patch(`${base}/ads/:id`, async ({ request, params }) => {
    const err = await simulate(); if (err) return err
    const user = currentUser(request)
    if (!user) return unauthorized()
    const ad = state.created.find(a => a.id === params.id)
    if (!ad) return notFound('Объявление')
    if (ad.authorId !== user.id) return fail(403, 'forbidden', 'Это чужое объявление')
    Object.assign(ad, await request.json())
    save()
    return json(ad)
  }),

  http.delete(`${base}/ads/:id`, async ({ request, params }) => {
    const err = await simulate(); if (err) return err
    const user = currentUser(request)
    if (!user) return unauthorized()
    const i = state.created.findIndex(a => a.id === params.id)
    if (i < 0) return notFound('Объявление')
    if (state.created[i]!.authorId !== user.id) return fail(403, 'forbidden', 'Это чужое объявление')
    state.created.splice(i, 1)
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
