import { http } from 'msw'
import { findAd, save, statusOf } from '../db'
import { createDialog, dialogsOf, findDialog, peerIdOf, scheduleReply, seedChat, toDialog, toMessage } from '../chat'
import { currentUser, fail, json, noContent, notFound, simulate, unauthorized } from '../utils'
import type { DialogRecord } from '../chat'
import type { UserRecord } from '../fixtures/users'

/** Диалог текущего пользователя или готовый ответ с ошибкой */
function mine(request: Request, id: string): { user: UserRecord, d: DialogRecord } | Response {
  const user = currentUser(request)
  if (!user) return unauthorized()
  const d = findDialog(id)
  if (!d || (d.authorId !== user.id && d.clientId !== user.id)) return notFound('Диалог')
  return { user, d }
}

const MAX_LEN = 2000

export const chatHandlers = (base: string) => [
  http.get(`${base}/dialogs`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const user = currentUser(request)
    if (!user) return unauthorized()
    seedChat()
    const list = dialogsOf(user.id)
      .map(d => toDialog(d, user.id))
      // пустой диалог (открыли, но не написали) в списке не показываем
      .filter(d => d.lastMessage)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    return json(list)
  }),

  http.get(`${base}/dialogs/unread`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const user = currentUser(request)
    if (!user) return unauthorized()
    seedChat()
    return json({ count: dialogsOf(user.id).reduce((n, d) => n + toDialog(d, user.id).unread, 0) })
  }),

  http.post(`${base}/dialogs`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const user = currentUser(request)
    if (!user) return unauthorized()
    const { adId } = (await request.json()) as { adId?: string }
    const ad = adId ? findAd(adId) : undefined
    if (!ad || statusOf(ad) === 'deleted') return notFound('Объявление')
    if (ad.authorId === user.id) return fail(409, 'own_ad', 'Это ваше объявление')
    seedChat()
    // один диалог на пару «пользователь - объявление»
    const d = dialogsOf(user.id).find(x => x.adId === ad.id && x.clientId === user.id) ?? createDialog(ad.id, ad.authorId, user.id)
    return json(toDialog(d, user.id))
  }),

  http.get(`${base}/dialogs/:id`, async ({ request, params }) => {
    const err = await simulate(); if (err) return err
    seedChat()
    const r = mine(request, String(params.id)); if (r instanceof Response) return r
    return json(toDialog(r.d, r.user.id))
  }),

  http.get(`${base}/dialogs/:id/messages`, async ({ request, params }) => {
    const err = await simulate(); if (err) return err
    seedChat()
    const r = mine(request, String(params.id)); if (r instanceof Response) return r
    const after = new URL(request.url).searchParams.get('after')
    let msgs = r.d.messages.filter(m => m.createdAt <= Date.now())
    if (after) {
      const i = msgs.findIndex(m => m.id === after)
      msgs = i >= 0 ? msgs.slice(i + 1) : msgs
    }
    return json(msgs.map(m => toMessage(r.d, m)))
  }),

  http.post(`${base}/dialogs/:id/messages`, async ({ request, params }) => {
    const err = await simulate(); if (err) return err
    const r = mine(request, String(params.id)); if (r instanceof Response) return r
    const { text } = (await request.json()) as { text?: string }
    const body = text?.trim() ?? ''
    if (!body) return fail(422, 'validation', 'Напишите сообщение', { text: 'Напишите сообщение' })
    if (body.length > MAX_LEN) return fail(422, 'validation', 'Сообщение слишком длинное', { text: 'Сообщение слишком длинное' })
    const peer = peerIdOf(r.d, r.user.id)
    if (r.d.blockedBy.includes(peer)) return fail(403, 'blocked', 'Пользователь ограничил переписку с вами')
    if (r.d.blockedBy.includes(r.user.id)) return fail(403, 'blocked', 'Вы заблокировали этого пользователя')
    const m = { id: `m-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`, authorId: r.user.id, text: body, createdAt: Date.now() }
    r.d.messages.push(m)
    scheduleReply(r.d, r.user.id)
    save()
    return json(toMessage(r.d, m), 201)
  }),

  http.post(`${base}/dialogs/:id/read`, async ({ request, params }) => {
    const err = await simulate(); if (err) return err
    const r = mine(request, String(params.id)); if (r instanceof Response) return r
    const now = Date.now()
    for (const m of r.d.messages) if (m.authorId !== r.user.id && m.createdAt <= now && !m.readAt) m.readAt = now
    save()
    return noContent()
  }),

  http.post(`${base}/dialogs/:id/block`, async ({ request, params }) => {
    const err = await simulate(); if (err) return err
    const r = mine(request, String(params.id)); if (r instanceof Response) return r
    if (!r.d.blockedBy.includes(r.user.id)) r.d.blockedBy.push(r.user.id)
    save()
    return json(toDialog(r.d, r.user.id))
  }),

  http.delete(`${base}/dialogs/:id/block`, async ({ request, params }) => {
    const err = await simulate(); if (err) return err
    const r = mine(request, String(params.id)); if (r instanceof Response) return r
    r.d.blockedBy = r.d.blockedBy.filter(id => id !== r.user.id)
    save()
    return json(toDialog(r.d, r.user.id))
  }),

  http.post(`${base}/messages/:id/report`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    if (!currentUser(request)) return unauthorized()
    const { reason } = (await request.json()) as { reason?: string }
    if (!reason) return fail(422, 'validation', 'Выберите причину', { reason: 'Выберите причину' })
    // жалоба уходит в очередь администратора (этап 3); в моке просто принимается
    return noContent()
  })
]
