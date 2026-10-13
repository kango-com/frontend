import { http } from 'msw'
import { findAd, save, state, toCard } from '../db'
import { currentUser, json, noContent, notFound, simulate, unauthorized } from '../utils'

const cards = (ids: string[], favorites: string[]) =>
  ids.map(findAd).filter((a): a is NonNullable<ReturnType<typeof findAd>> => !!a).map(a => toCard(a, favorites))

export const meHandlers = (base: string) => [
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
