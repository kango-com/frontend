import { http } from 'msw'
import type { CreateTicketPayload, Ticket, TicketAttachment, TicketCategory, TicketMessage, TicketStatus } from '~/types'
import { findAd, save, state } from '../db'
import { demoUser, type UserRecord } from '../fixtures/users'
import { currentUser, fail, json, noContent, notFound, simulate, unauthorized } from '../utils'

/**
 * Тикеты в моке. Ответ поддержки имитируется: сообщение с датой в будущем «приходит», когда наступает его время,
 * и вместе с ним статус меняется на «ожидает ответа пользователя». Админ-панель (этап 3) будет отвечать по-настоящему.
 */
interface TicketMessageRecord { id: string, from: 'user' | 'support', text: string, attachments: TicketAttachment[], createdAt: number, readAt?: number }
interface TicketRecord {
  id: string
  number: number
  userId: string
  subject: string
  category: TicketCategory
  /** Статус, заданный действием пользователя; ответ поддержки поверх него переводит в waiting */
  status: TicketStatus
  adId?: string
  createdAt: number
  resolvedAt?: number
  messages: TicketMessageRecord[]
}
interface SupportState { tickets: Record<string, TicketRecord>, seeded: boolean, seq: number }

const MIN = 60_000
const DAY = 24 * 60 * MIN
/** Сколько дней после решения обращение можно переоткрыть (настройка администратора) */
const REOPEN_DAYS = 7
const SUPPORT_NAME = 'Поддержка Kango'
const MAX_TEXT = 3000
const CATEGORIES: TicketCategory[] = ['ad', 'account', 'payment', 'complaint', 'other']

const support = (): SupportState => ((state as unknown as { support?: SupportState }).support ??= { tickets: {}, seeded: false, seq: 10_230 })
const now = () => Date.now()
const visible = (t: TicketRecord) => t.messages.filter(m => m.createdAt <= now())

/** Текущий статус: пришедший ответ поддержки после последнего сообщения пользователя - «ожидает ответа» */
function statusOf(t: TicketRecord): TicketStatus {
  if (t.status === 'resolved' && t.resolvedAt && now() - t.resolvedAt > REOPEN_DAYS * DAY) return 'closed'
  if (t.status === 'resolved' || t.status === 'closed') return t.status
  const msgs = visible(t)
  const last = msgs.at(-1)
  if (last?.from === 'support') return 'waiting'
  return msgs.some(m => m.from === 'support') ? 'in_progress' : t.status
}

function toMessage(t: TicketRecord, m: TicketMessageRecord, user: UserRecord): TicketMessage {
  return { id: m.id, ticketId: t.id, from: m.from, authorName: m.from === 'support' ? SUPPORT_NAME : user.name, text: m.text, attachments: m.attachments, createdAt: new Date(m.createdAt).toISOString() }
}

function toTicket(t: TicketRecord, user: UserRecord): Ticket {
  const msgs = visible(t)
  const last = msgs.at(-1)
  const status = statusOf(t)
  return {
    id: t.id,
    number: t.number,
    subject: t.subject,
    category: t.category,
    status,
    adId: t.adId,
    adTitle: t.adId ? findAd(t.adId)?.title : undefined,
    createdAt: new Date(t.createdAt).toISOString(),
    updatedAt: new Date(last?.createdAt ?? t.createdAt).toISOString(),
    lastMessage: last ? toMessage(t, last, user) : undefined,
    unread: msgs.filter(m => m.from === 'support' && !m.readAt).length,
    reopenUntil: status === 'resolved' && t.resolvedAt ? new Date(t.resolvedAt + REOPEN_DAYS * DAY).toISOString() : undefined
  }
}

const REPLIES: Record<TicketCategory, string> = {
  ad: 'Здравствуйте! Посмотрели ваше объявление. Уточните, пожалуйста, что именно не получается: публикация, редактирование или показ в поиске?',
  account: 'Здравствуйте! Проверили аккаунт, ограничений нет. Попробуйте выйти и войти снова. Если ошибка повторится, пришлите снимок экрана.',
  payment: 'Здравствуйте! Видим платёж. Опция подключится в течение 15 минут. Если этого не произошло, напишите, пожалуйста, время оплаты.',
  complaint: 'Здравствуйте! Спасибо за сигнал. Передали жалобу модератору, результат проверки сообщим здесь.',
  other: 'Здравствуйте! Спасибо за обращение. Уточните, пожалуйста, подробности, чтобы мы могли помочь.'
}
const FOLLOW_UP = 'Спасибо за уточнение! Проблему исправили. Если всё работает, нажмите «Вопрос решён».'

/** Ответ поддержки через 8-12 с: так в моке видны и «в работе», и приход ответа */
function scheduleSupport(t: TicketRecord, text: string) {
  t.messages.push({ id: `tm-${now().toString(36)}s`, from: 'support', text, attachments: [], createdAt: now() + 8000 + Math.round(Math.random() * 4000) })
}

function seed(userId: string) {
  const s = support()
  if (s.seeded || userId !== demoUser.id) return
  const t = now()
  const add = (rec: Omit<TicketRecord, 'number'>) => { s.tickets[rec.id] = { ...rec, number: ++s.seq } }
  add({
    id: 'tk-demo-1', userId, subject: 'Не подключилось поднятие объявления', category: 'payment', status: 'resolved', adId: 'my-1',
    createdAt: t - 13 * DAY, resolvedAt: t - 11 * DAY,
    messages: [
      { id: 'tm-d1-1', from: 'user', text: 'Оплатил поднятие, но объявление не поднялось.', attachments: [], createdAt: t - 13 * DAY, readAt: t - 13 * DAY },
      { id: 'tm-d1-2', from: 'support', text: 'Здравствуйте! Платёж прошёл с задержкой банка, опцию подключили вручную. Срок продлили на сутки.', attachments: [], createdAt: t - 12 * DAY, readAt: t - 12 * DAY }
    ]
  })
  add({
    id: 'tk-demo-2', userId, subject: 'Объявление отклонили, не понимаю почему', category: 'ad', status: 'in_progress', adId: 'my-4',
    createdAt: t - 2 * DAY,
    messages: [
      { id: 'tm-d2-1', from: 'user', text: 'Моё объявление отклонили. Телефон я убрал из описания, что ещё нужно исправить?', attachments: [], createdAt: t - 2 * DAY, readAt: t - 2 * DAY },
      { id: 'tm-d2-2', from: 'support', text: 'Здравствуйте! В названии осталась ссылка на сторонний сайт. Уберите её и сохраните объявление, оно снова уйдёт на проверку.', attachments: [], createdAt: t - 3 * 60 * MIN }
    ]
  })
  s.seeded = true
  save()
}

function own(request: Request, id: string): { user: UserRecord, t: TicketRecord } | Response {
  const user = currentUser(request)
  if (!user) return unauthorized()
  seed(user.id)
  const t = support().tickets[id]
  if (!t || t.userId !== user.id) return notFound('Обращение')
  return { user, t }
}

function validAttachments(list: unknown): TicketAttachment[] | null {
  if (!Array.isArray(list)) return []
  if (list.length > 3) return null
  return list.filter((a): a is TicketAttachment => !!a && typeof a.url === 'string').map(a => ({ url: a.url, name: String(a.name ?? 'file'), size: Number(a.size) || 0, type: String(a.type ?? '') }))
}

export const supportHandlers = (base: string) => [
  http.get(`${base}/tickets`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const user = currentUser(request)
    if (!user) return unauthorized()
    seed(user.id)
    const list = Object.values(support().tickets).filter(t => t.userId === user.id).map(t => toTicket(t, user))
    return json(list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)))
  }),

  http.get(`${base}/tickets/unread`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const user = currentUser(request)
    if (!user) return unauthorized()
    seed(user.id)
    const count = Object.values(support().tickets).filter(t => t.userId === user.id).reduce((n, t) => n + toTicket(t, user).unread, 0)
    return json({ count })
  }),

  http.post(`${base}/tickets`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const user = currentUser(request)
    if (!user) return unauthorized()
    const p = (await request.json()) as Partial<CreateTicketPayload>
    const fields: Record<string, string> = {}
    if (!p.subject?.trim()) fields.subject = 'Укажите тему'
    if (!p.category || !CATEGORIES.includes(p.category)) fields.category = 'Выберите категорию'
    if (!p.text?.trim()) fields.text = 'Опишите вопрос'
    else if (p.text.length > MAX_TEXT) fields.text = 'Не больше 3000 символов'
    const attachments = validAttachments(p.attachments)
    if (!attachments) fields.attachments = 'Не больше 3 файлов'
    if (p.adId) {
      const ad = findAd(p.adId)
      if (!ad || ad.authorId !== user.id) fields.adId = 'Можно привязать только своё объявление'
    }
    if (Object.keys(fields).length) return fail(422, 'validation', 'Проверьте поля формы', fields)
    seed(user.id)
    const s = support()
    const t: TicketRecord = {
      id: `tk-${now().toString(36)}`, number: ++s.seq, userId: user.id, subject: p.subject!.trim(), category: p.category!, status: 'new', adId: p.adId,
      createdAt: now(), messages: [{ id: `tm-${now().toString(36)}u`, from: 'user', text: p.text!.trim(), attachments: attachments!, createdAt: now() }]
    }
    scheduleSupport(t, REPLIES[t.category])
    s.tickets[t.id] = t
    save()
    return json(toTicket(t, user), 201)
  }),

  http.get(`${base}/tickets/:id`, async ({ request, params }) => {
    const err = await simulate(); if (err) return err
    const r = own(request, String(params.id)); if (r instanceof Response) return r
    return json(toTicket(r.t, r.user))
  }),

  http.get(`${base}/tickets/:id/messages`, async ({ request, params }) => {
    const err = await simulate(); if (err) return err
    const r = own(request, String(params.id)); if (r instanceof Response) return r
    return json(visible(r.t).map(m => toMessage(r.t, m, r.user)))
  }),

  http.post(`${base}/tickets/:id/messages`, async ({ request, params }) => {
    const err = await simulate(); if (err) return err
    const r = own(request, String(params.id)); if (r instanceof Response) return r
    const st = statusOf(r.t)
    if (st === 'resolved' || st === 'closed') return fail(409, 'closed', 'Обращение закрыто. Переоткройте его или создайте новое.')
    const { text, attachments } = (await request.json()) as { text?: string, attachments?: unknown }
    const files = validAttachments(attachments)
    if (!text?.trim() && !files?.length) return fail(422, 'validation', 'Напишите сообщение', { text: 'Напишите сообщение' })
    if (!files) return fail(422, 'validation', 'Не больше 3 файлов', { attachments: 'Не больше 3 файлов' })
    const m: TicketMessageRecord = { id: `tm-${now().toString(36)}u`, from: 'user', text: text?.trim() ?? '', attachments: files, createdAt: now() }
    r.t.messages.push(m)
    r.t.status = 'in_progress'
    // поддержка отвечает на первое уточнение пользователя, дальше ждёт «Вопрос решён»
    if (r.t.messages.filter(x => x.from === 'support').length < 2) scheduleSupport(r.t, FOLLOW_UP)
    save()
    return json(toMessage(r.t, m, r.user), 201)
  }),

  http.post(`${base}/tickets/:id/read`, async ({ request, params }) => {
    const err = await simulate(); if (err) return err
    const r = own(request, String(params.id)); if (r instanceof Response) return r
    for (const m of visible(r.t)) if (m.from === 'support' && !m.readAt) m.readAt = now()
    save()
    return noContent()
  }),

  http.post(`${base}/tickets/:id/resolve`, async ({ request, params }) => {
    const err = await simulate(); if (err) return err
    const r = own(request, String(params.id)); if (r instanceof Response) return r
    if (statusOf(r.t) === 'closed') return fail(409, 'closed', 'Обращение уже закрыто')
    // ответ поддержки, который ещё «не пришёл», отменяется
    r.t.messages = visible(r.t)
    r.t.status = 'resolved'
    r.t.resolvedAt = now()
    save()
    return json(toTicket(r.t, r.user))
  }),

  http.post(`${base}/tickets/:id/reopen`, async ({ request, params }) => {
    const err = await simulate(); if (err) return err
    const r = own(request, String(params.id)); if (r instanceof Response) return r
    if (statusOf(r.t) !== 'resolved') return fail(409, 'not_resolved', 'Переоткрыть можно только решённое обращение в течение 7 дней')
    r.t.status = 'in_progress'
    r.t.resolvedAt = undefined
    save()
    return json(toTicket(r.t, r.user))
  })
]
