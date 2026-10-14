import { defineStore } from 'pinia'
import { authApi, isApiError, useAuthToken } from '~/api'
import type { ApiError, LoadStatus, LoginPayload, RegisterPayload, SocialProvider, User } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const token = useAuthToken()
  const user = ref<User | null>(null)
  const status = ref<LoadStatus>('idle')
  const error = ref<ApiError | null>(null)
  /** Ошибки полей последней формы (login, register, reset) */
  const fieldErrors = computed(() => error.value?.fields ?? {})
  const isAuthed = computed(() => !!user.value)

  function applySession(result: { user: User, token: string }) {
    token.value = result.token
    user.value = result.user
  }

  /** Обёртка действий: единый статус, ошибка пробрасывается вызывающему */
  async function run<T>(fn: () => Promise<T>): Promise<T> {
    status.value = 'loading'
    error.value = null
    try {
      const result = await fn()
      status.value = 'success'
      return result
    } catch (e) {
      status.value = 'error'
      error.value = isApiError(e) ? e : { status: 0, code: 'unknown', message: tr('Что-то пошло не так') }
      throw e
    }
  }

  /** Восстановить пользователя по токену из cookie (вызывается при старте приложения) */
  async function fetchMe() {
    if (!token.value) { user.value = null; return }
    try {
      user.value = await authApi.me()
    } catch (e) {
      if (isApiError(e) && e.status === 401) { token.value = null; user.value = null }
    }
  }

  const login = (payload: LoginPayload) => run(async () => applySession(await authApi.login(payload)))
  const register = (payload: RegisterPayload) => run(async () => applySession(await authApi.register(payload)))
  const social = (provider: SocialProvider) => run(async () => applySession(await authApi.social(provider)))
  const forgot = (email: string) => run(() => authApi.forgot(email))
  const validateResetToken = (value: string) => run(() => authApi.validateResetToken(value))
  const reset = (value: string, password: string) => run(() => authApi.reset(value, password))

  async function logout() {
    try { await authApi.logout() } catch { /* токен всё равно сбрасываем */ }
    token.value = null
    user.value = null
    status.value = 'idle'
  }

  function clearError() { error.value = null }

  return { user, status, error, fieldErrors, isAuthed, fetchMe, login, register, social, forgot, validateResetToken, reset, logout, clearError }
})
