import type { AdCard, AdStatus, MyAd, Purchase, SearchHistoryItem } from '~/types'
import { buildAds, type AdRecord } from './fixtures/ads'
import { demoUser, type UserRecord } from './fixtures/users'
import { promoPackages } from './fixtures/content'

/**
 * Состояние мок-бэкенда в памяти вкладки. Пользователи, сессии, избранное, история поиска,
 * просмотренные, платежи, созданные объявления сохраняются в localStorage.
 */
interface Persisted {
  users: UserRecord[]
  sessions: Record<string, string>
  favorites: Record<string, string[]>
  viewed: Record<string, string[]>
  history: Record<string, SearchHistoryItem[]>
  created: AdRecord[]
  payments: Record<string, { id: string, adId: string, packageId: string, status: 'pending' | 'paid' | 'failed' | 'cancelled' }>
  promoted: Record<string, string>
  resetTokens: Record<string, { email: string, expiresAt: number }>
  /** История платных опций по пользователям */
  purchases: Record<string, Purchase[]>
  /** Демо-объявления и покупки демо-пользователя уже созданы */
  demoSeeded: boolean
}

const KEY = 'kango.mock.db.v1'
const DAY = 86_400_000
/** Через сколько мок «одобряет» объявление на модерации */
export const MODERATION_MS = 20_000

function empty(): Persisted {
  return { users: [demoUser], sessions: {}, favorites: {}, viewed: {}, history: {}, created: [], payments: {}, promoted: {}, resetTokens: {}, purchases: {}, demoSeeded: false }
}

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...empty(), ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return empty()
}

export const state: Persisted = load()
export const seedAds: AdRecord[] = buildAds()

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* ignore */ }
}

export const statusOf = (ad: AdRecord): AdStatus => ad.status ?? 'active'

/** Модерация в моке: объявление одобряется через MODERATION_MS после отправки (кроме удерживаемых демо-объявлений) */
export function settleModeration() {
  let changed = false
  for (const ad of state.created) {
    if (ad.status === 'moderation' && !ad.holdModeration && ad.moderationSince && Date.now() - ad.moderationSince > MODERATION_MS) {
      ad.status = 'active'
      ad.moderationSince = undefined
      ad.expiresAt ??= new Date(Date.now() + 30 * DAY).toISOString()
      changed = true
    }
  }
  if (changed) save()
}

export function allAds(): AdRecord[] {
  return [...state.created, ...seedAds]
}

/** Объявления для публичной выдачи: только активные */
export function publicAds(): AdRecord[] {
  settleModeration()
  return allAds().filter(a => statusOf(a) === 'active')
}

export function findAd(id: string): AdRecord | undefined {
  return allAds().find(a => a.id === id)
}

const until = (iso?: string) => (iso && new Date(iso).getTime() > Date.now() ? iso : undefined)

export function toCard(ad: AdRecord, favorites: string[] = []): AdCard {
  return {
    id: ad.id,
    section: ad.section,
    title: ad.title,
    price: ad.price,
    location: ad.location,
    image: ad.image,
    createdAt: ad.createdAt,
    tags: ad.tags,
    employer: ad.employer,
    isFavorite: favorites.includes(ad.id),
    promoted: ad.promoted || !!state.promoted[ad.id] || !!until(ad.promotedUntil),
    highlighted: ad.highlighted || !!until(ad.highlightedUntil)
  }
}

export function toMyAd(ad: AdRecord): MyAd {
  return {
    ...toCard(ad),
    status: statusOf(ad),
    rejectReason: ad.rejectReason,
    views: ad.views ?? 0,
    expiresAt: statusOf(ad) === 'active' ? ad.expiresAt : undefined,
    promotedUntil: until(ad.promotedUntil),
    highlightedUntil: until(ad.highlightedUntil)
  }
}

/** Подключение оплаченного пакета: сроки опций на объявлении и запись в истории */
export function applyPackage(userId: string, adId: string, packageId: string, status: Purchase['status'] = 'paid', at = Date.now()): Purchase | undefined {
  const pkg = promoPackages.find(p => p.id === packageId)
  const ad = findAd(adId)
  if (!pkg || !ad) return undefined
  const end = new Date(at + pkg.days * DAY).toISOString()
  if (status === 'paid') {
    if (packageId === 'raise' || packageId === 'max') ad.promotedUntil = end
    if (packageId === 'highlight' || packageId === 'max') ad.highlightedUntil = end
  }
  const purchase: Purchase = {
    id: `pur-${at.toString(36)}-${adId}`,
    adId,
    adTitle: ad.title,
    packageId: pkg.id,
    title: pkg.title,
    amount: pkg.price,
    status,
    createdAt: new Date(at).toISOString(),
    activeUntil: status === 'paid' ? end : undefined
  }
  ;(state.purchases[userId] ??= []).unshift(purchase)
  return purchase
}

/** Демо-пользователь получает объявления во всех статусах и историю покупок, чтобы кабинет не был пустым */
function seedDemo() {
  if (state.demoSeeded) return
  const author = { id: demoUser.id, name: demoUser.name, online: true, since: demoUser.createdAt }
  const pick = ['work', 'realty', 'goods', 'services', 'realty', 'goods']
    .map((section, i) => seedAds.filter(a => a.section === section)[i] ?? seedAds[i]!)
  const plan: Partial<AdRecord>[] = [
    { status: 'active', views: 342 },
    { status: 'active', views: 1280 },
    { status: 'moderation', views: 0, holdModeration: true },
    { status: 'rejected', views: 0, rejectReason: 'В описании указан номер телефона. Укажите контакты в полях «Телефон», WhatsApp или Telegram.' },
    { status: 'hidden', views: 87 },
    { status: 'active', views: 56 }
  ]
  const now = Date.now()
  pick.forEach((src, i) => {
    const created = now - (i + 1) * 3 * DAY
    state.created.push({
      ...structuredClone(src),
      ...plan[i],
      id: `my-${i + 1}`,
      number: 870_000_100 + i,
      promoted: false,
      highlighted: false,
      createdAt: new Date(created).toISOString(),
      expiresAt: new Date(created + 30 * DAY).toISOString(),
      author,
      contacts: { phone: demoUser.phone, whatsapp: demoUser.phone, telegram: demoUser.telegram },
      authorId: demoUser.id
    } as AdRecord)
  })
  // история: оплаченный «Максимум», оплаченное поднятие, отменённая оплата
  applyPackage(demoUser.id, 'my-1', 'raise', 'paid', now - 12 * DAY)
  applyPackage(demoUser.id, 'my-6', 'highlight', 'cancelled', now - 4 * DAY)
  applyPackage(demoUser.id, 'my-2', 'max', 'paid', now - 2 * DAY)
  state.demoSeeded = true
  save()
}

seedDemo()

/** Настройки поведения мока (меняются из консоли: localStorage.setItem('kango.mock.delay', '800')) */
export function mockSettings() {
  const delay = Number(localStorage.getItem('kango.mock.delay') ?? 250)
  const errors = localStorage.getItem('kango.mock.errors') === 'true'
  return { delay: Number.isFinite(delay) ? delay : 250, errors }
}
