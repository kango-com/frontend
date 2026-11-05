import type { AdCard, ChangePasswordPayload, ProfilePatch, Purchase, User } from '~/types'
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

/** Профиль текущего пользователя (кабинет) */
export const profileApi = {
  update: (patch: ProfilePatch) => apiFetch<User>('/me', { method: 'PATCH', body: patch }),
  changePassword: (payload: ChangePasswordPayload) => apiFetch<void>('/me/password', { method: 'POST', body: payload }),
  purchases: () => apiFetch<Purchase[]>('/me/purchases')
}
