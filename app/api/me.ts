import type { AdCard } from '~/types'
import { apiFetch } from './client'

export const favoritesApi = {
  list: () => apiFetch<AdCard[]>('/favorites'),
  add: (adId: string) => apiFetch<void>(`/favorites/${adId}`, { method: 'PUT' }),
  remove: (adId: string) => apiFetch<void>(`/favorites/${adId}`, { method: 'DELETE' })
}

export const viewedApi = {
  list: () => apiFetch<AdCard[]>('/me/viewed'),
  add: (adId: string) => apiFetch<void>(`/me/viewed/${adId}`, { method: 'POST' })
}
