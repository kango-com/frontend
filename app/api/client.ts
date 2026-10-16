import type { ApiError } from '~/types'
import { tr } from '~/utils/tr'

type QueryValue = string | number | boolean | null | undefined | (string | number)[]
export type ApiQuery = Record<string, QueryValue>

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  query?: ApiQuery
  body?: unknown
  signal?: AbortSignal
}

/** Токен сессии в cookie (доступен и на сервере, и в браузере) */
export function useAuthToken() {
  return useCookie<string | null>('kango_token', { sameSite: 'lax', maxAge: 60 * 60 * 24 * 30, default: () => null })
}

function cleanQuery(query?: ApiQuery) {
  if (!query) return undefined
  const out: Record<string, string | number | boolean> = {}
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue
    if (Array.isArray(value)) {
      if (value.length) out[key] = value.join(',')
    } else {
      out[key] = value
    }
  }
  return out
}

interface FetchErrorLike {
  statusCode?: number
  status?: number
  data?: Partial<ApiError>
  message?: string
  name?: string
  cause?: { name?: string }
}

/** Приводит любую ошибку запроса к единому формату */
export function toApiError(e: unknown): ApiError {
  const err = (e ?? {}) as FetchErrorLike
  const status = err.statusCode ?? err.status ?? 0
  if (err.name === 'AbortError' || err.cause?.name === 'AbortError') return { status: 0, code: 'aborted', message: tr('Запрос отменён') }
  if (!status) return { status: 0, code: 'network', message: tr('Нет соединения с сервером') }
  return {
    status,
    code: err.data?.code ?? `http_${status}`,
    message: err.data?.message ? tr(err.data.message) : tr('Что-то пошло не так, попробуйте ещё раз'),
    fields: err.data?.fields ? Object.fromEntries(Object.entries(err.data.fields).map(([k, v]) => [k, tr(v)])) : undefined
  }
}

export function isApiError(e: unknown): e is ApiError {
  return !!e && typeof e === 'object' && 'code' in e && 'status' in e && 'message' in e
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/** Единая точка входа во все запросы к API. Безопасные GET один раз повторяются при сбое сети или ответе 5xx */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const retries = (options.method ?? 'GET') === 'GET' ? 2 : 0
  for (let attempt = 0; ; attempt++) {
    try {
      return await request<T>(path, options)
    } catch (e) {
      const err = e as ApiError
      const transient = err.code === 'network' || err.status >= 500
      if (attempt >= retries || !transient || options.signal?.aborted) throw e
      await wait(300 * (attempt + 1))
    }
  }
}

async function request<T>(path: string, options: RequestOptions): Promise<T> {
  const config = useRuntimeConfig()
  const token = useAuthToken()
  try {
    const data = await $fetch<T>(path, {
      baseURL: config.public.apiBase as string,
      method: options.method ?? 'GET',
      query: cleanQuery(options.query),
      body: options.body as Record<string, unknown> | undefined,
      signal: options.signal,
      headers: token.value ? { Authorization: `Bearer ${token.value}` } : undefined
    })
    // API ответило HTML-страницей (запрос не дошёл до мока или бэкенда): это не данные, а сбой связи
    if (typeof data === 'string' && /^\s*<(!doctype|html)/i.test(data)) throw Object.assign(new Error('html instead of json'), { status: 0 })
    return data
  } catch (e) {
    throw toApiError(e)
  }
}
