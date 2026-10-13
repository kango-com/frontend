import type { AuthResult, LoginPayload, RegisterPayload, SocialProvider, User } from '~/types'
import { apiFetch } from './client'

export const authApi = {
  login: (payload: LoginPayload) => apiFetch<AuthResult>('/auth/login', { method: 'POST', body: payload }),
  register: (payload: RegisterPayload) => apiFetch<AuthResult>('/auth/register', { method: 'POST', body: payload }),
  social: (provider: SocialProvider) => apiFetch<AuthResult>('/auth/social', { method: 'POST', body: { provider } }),
  logout: () => apiFetch<void>('/auth/logout', { method: 'POST' }),
  me: () => apiFetch<User>('/auth/me'),
  /** В dev-режиме мока ответ содержит `devLink` со ссылкой сброса */
  forgot: (email: string) => apiFetch<{ sent: true, devLink?: string }>('/auth/forgot', { method: 'POST', body: { email } }),
  validateResetToken: (token: string) => apiFetch<{ valid: boolean }>('/auth/reset/validate', { query: { token } }),
  reset: (token: string, password: string) => apiFetch<{ ok: true }>('/auth/reset', { method: 'POST', body: { token, password } })
}
