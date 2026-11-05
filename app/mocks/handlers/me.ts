import { http } from 'msw'
import type { ProfilePatch } from '~/types'
import { findAd, save, state, toCard } from '../db'
import { currentUser, fail, json, noContent, notFound, simulate, unauthorized } from '../utils'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
/** Израильский номер: +972 или 0, затем 8-9 цифр (пробелы и дефисы допускаются) */
const PHONE = /^(\+972|0)\d{8,9}$/

const cards = (ids: string[], favorites: string[]) =>
  ids.map(findAd).filter((a): a is NonNullable<ReturnType<typeof findAd>> => !!a).map(a => toCard(a, favorites))

export const meHandlers = (base: string) => [
  http.patch(`${base}/me`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const user = currentUser(request)
    if (!user) return unauthorized()
    const patch = (await request.json()) as ProfilePatch
    const fields: Record<string, string> = {}
    if (patch.name !== undefined && !patch.name.trim()) fields.name = 'Укажите имя'
    if (patch.email !== undefined && !EMAIL.test(patch.email)) fields.email = 'Введите корректный e-mail'
    else if (patch.email && state.users.some(u => u.id !== user.id && u.email.toLowerCase() === patch.email!.toLowerCase())) fields.email = 'Этот e-mail уже зарегистрирован'
    if (patch.phone && !PHONE.test(patch.phone.replace(/[\s-]/g, ''))) fields.phone = 'Введите номер в формате +972 50 123 45 67'
    if (patch.telegram && !/^@?[A-Za-z0-9_]{5,32}$|^https:\/\/t\.me\/[A-Za-z0-9_]{5,32}$/.test(patch.telegram)) fields.telegram = 'Укажите @username или ссылку t.me'
    if (Object.keys(fields).length) return fail(422, 'validation', 'Проверьте поля формы', fields)
    const allowed: (keyof ProfilePatch)[] = ['name', 'email', 'avatarUrl', 'phone', 'whatsapp', 'telegram', 'language', 'notifications']
    for (const k of allowed) if (k in patch) (user as unknown as Record<string, unknown>)[k] = patch[k]
    if (patch.name) user.name = patch.name.trim()
    save()
    const { password: _p, ...pub } = user
    return json(pub)
  }),

  http.post(`${base}/me/password`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const user = currentUser(request)
    if (!user) return unauthorized()
    const { current, next } = (await request.json()) as { current?: string, next?: string }
    if (!current || current !== user.password) return fail(422, 'validation', 'Неверный текущий пароль', { current: 'Неверный текущий пароль' })
    if (!next || next.length < 8) return fail(422, 'validation', 'Короткий пароль', { next: 'Короткий пароль' })
    user.password = next
    save()
    return noContent()
  }),

  http.get(`${base}/me/purchases`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const user = currentUser(request)
    if (!user) return unauthorized()
    return json(state.purchases[user.id] ?? [])
  }),

  http.get(`${base}/favorites`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const user = currentUser(request)
    if (!user) return unauthorized()
    const ids = state.favorites[user.id] ?? []
    return json(cards(ids, ids))
  }),

  http.put(`${base}/favorites/:adId`, async ({ request, params }) => {
    const err = await simulate(); if (err) return err
    const user = currentUser(request)
    if (!user) return unauthorized()
    if (!findAd(String(params.adId))) return notFound('Объявление')
    const list = (state.favorites[user.id] ??= [])
    if (!list.includes(String(params.adId))) list.unshift(String(params.adId))
    save()
    return noContent()
  }),

  http.delete(`${base}/favorites/:adId`, async ({ request, params }) => {
    const err = await simulate(); if (err) return err
    const user = currentUser(request)
    if (!user) return unauthorized()
    state.favorites[user.id] = (state.favorites[user.id] ?? []).filter(id => id !== params.adId)
    save()
    return noContent()
  }),

  http.get(`${base}/me/viewed`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const user = currentUser(request)
    if (!user) return unauthorized()
    return json(cards(state.viewed[user.id] ?? [], state.favorites[user.id] ?? []))
  }),

  http.post(`${base}/me/viewed/:adId`, async ({ request, params }) => {
    const err = await simulate(); if (err) return err
    const user = currentUser(request)
    if (!user) return unauthorized()
    const id = String(params.adId)
    state.viewed[user.id] = [id, ...(state.viewed[user.id] ?? []).filter(v => v !== id)].slice(0, 20)
    save()
    return noContent()
  })
]
