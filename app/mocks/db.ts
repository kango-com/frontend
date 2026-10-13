import type { AdCard, SearchHistoryItem } from '~/types'
import { buildAds, type AdRecord } from './fixtures/ads'
import { demoUser, type UserRecord } from './fixtures/users'

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
}

const KEY = 'kango.mock.db.v1'

function empty(): Persisted {
  return { users: [demoUser], sessions: {}, favorites: {}, viewed: {}, history: {}, created: [], payments: {}, promoted: {}, resetTokens: {} }
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

export function allAds(): AdRecord[] {
  return [...state.created, ...seedAds]
}

export function findAd(id: string): AdRecord | undefined {
  return allAds().find(a => a.id === id)
}

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
    promoted: ad.promoted || !!state.promoted[ad.id],
    highlighted: ad.highlighted
  }
}

/** Настройки поведения мока (меняются из консоли: localStorage.setItem('kango.mock.delay', '800')) */
export function mockSettings() {
  const delay = Number(localStorage.getItem('kango.mock.delay') ?? 250)
  const errors = localStorage.getItem('kango.mock.errors') === 'true'
  return { delay: Number.isFinite(delay) ? delay : 250, errors }
}
