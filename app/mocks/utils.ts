import { delay, HttpResponse } from 'msw'
import type { Pagination } from '~/types'
import { mockSettings, state } from './db'
import type { UserRecord } from './fixtures/users'

export const json = <T>(data: T, status = 200) => HttpResponse.json(data as never, { status })
export const noContent = () => new HttpResponse(null, { status: 204 })

export function fail(status: number, code: string, message: string, fields?: Record<string, string>) {
  return HttpResponse.json({ code, message, ...(fields ? { fields } : {}) }, { status })
}

export const unauthorized = () => fail(401, 'unauthorized', 'Нужно войти в аккаунт')
export const notFound = (what = 'Ресурс') => fail(404, 'not_found', `${what} не найден`)

/** Пауза и (по флагу) случайная серверная ошибка: применяется в каждом обработчике */
export async function simulate(): Promise<Response | undefined> {
  const { delay: ms, errors } = mockSettings()
  if (ms) await delay(ms)
  if (errors && Math.random() < 0.1) return fail(500, 'server', 'Сервер временно недоступен')
  return undefined
}

export function currentUser(request: Request): UserRecord | undefined {
  const header = request.headers.get('authorization')
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined
  const userId = token ? state.sessions[token] : undefined
  return userId ? state.users.find(u => u.id === userId) : undefined
}

export function paginate<T>(all: T[], url: URL, defaultLimit = 24): Pagination<T> {
  const page = Math.max(1, Number(url.searchParams.get('page') ?? 1))
  const limit = Math.min(60, Math.max(1, Number(url.searchParams.get('limit') ?? defaultLimit)))
  const start = (page - 1) * limit
  return { items: all.slice(start, start + limit), total: all.length, page, limit, hasMore: start + limit < all.length }
}

export const list = (url: URL, key: string): string[] =>
  (url.searchParams.get(key) ?? '').split(',').map(s => s.trim()).filter(Boolean)

export const makeId = (prefix: string) => `${prefix}${Math.random().toString(36).slice(2, 10)}`
