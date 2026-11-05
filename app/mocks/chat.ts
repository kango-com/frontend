import type { ChatMessage, ChatPeer, Dialog } from '~/types'
import { findAd, save, seedAds, state, statusOf } from './db'
import { authors, demoUser } from './fixtures/users'

/** Диалог в моке: участники, блокировки, сообщения. Сообщение с датой в будущем ещё «не пришло» (так имитируется ответ собеседника) */
export interface MessageRecord {
  id: string
  authorId: string
  text: string
  createdAt: number
  /** Когда прочитал получатель */
  readAt?: number
}

export interface DialogRecord {
  id: string
  adId: string
  /** Автор объявления */
  authorId: string
  /** Тот, кто написал по объявлению */
  clientId: string
  /** Кто кого заблокировал: id заблокировавших */
  blockedBy: string[]
  messages: MessageRecord[]
}

export interface ChatState {
  dialogs: Record<string, DialogRecord>
  seeded: boolean
}

const MIN = 60_000
const chat = (): ChatState => ((state as unknown as { chat?: ChatState }).chat ??= { dialogs: {}, seeded: false })

export const dialogsOf = (userId: string) => Object.values(chat().dialogs).filter(d => d.authorId === userId || d.clientId === userId)
export const findDialog = (id: string) => chat().dialogs[id]
export const peerIdOf = (d: DialogRecord, me: string) => (d.authorId === me ? d.clientId : d.authorId)
const visible = (d: DialogRecord) => d.messages.filter(m => m.createdAt <= Date.now())

export function peerInfo(id: string): ChatPeer {
  const user = state.users.find(u => u.id === id)
  if (user) return { id, name: user.name, avatarUrl: user.avatarUrl, online: false }
  const a = authors.find(x => x.id === id)
  return { id, name: a?.name ?? 'Пользователь', online: a?.online ?? false }
}

export function toMessage(d: DialogRecord, m: MessageRecord): ChatMessage {
  return { id: m.id, dialogId: d.id, authorId: m.authorId, text: m.text, createdAt: new Date(m.createdAt).toISOString(), read: !!m.readAt && m.readAt <= Date.now() }
}

export function toDialog(d: DialogRecord, me: string): Dialog {
  const ad = findAd(d.adId)
  const msgs = visible(d)
  const last = msgs.at(-1)
  const peer = peerIdOf(d, me)
  return {
    id: d.id,
    ad: ad
      ? { id: ad.id, title: ad.title, image: ad.image, price: ad.price, status: statusOf(ad) }
      : { id: d.adId, title: 'Объявление удалено', price: { amount: 0, currency: 'ILS' }, status: 'deleted' },
    peer: peerInfo(peer),
    role: d.authorId === me ? 'author' : 'client',
    lastMessage: last ? toMessage(d, last) : undefined,
    unread: msgs.filter(m => m.authorId !== me && !(m.readAt && m.readAt <= Date.now())).length,
    blockedByMe: d.blockedBy.includes(me),
    blockedMe: d.blockedBy.includes(peer),
    updatedAt: new Date(last?.createdAt ?? 0).toISOString()
  }
}

export function createDialog(adId: string, authorId: string, clientId: string): DialogRecord {
  const d: DialogRecord = { id: `dlg-${Date.now().toString(36)}`, adId, authorId, clientId, blockedBy: [], messages: [] }
  chat().dialogs[d.id] = d
  save()
  return d
}

const REPLIES = {
  // мне ответил автор объявления
  client: ['Здравствуйте! Да, актуально.', 'Можете позвонить, так быстрее договоримся.', 'Хорошо, давайте завтра после 17:00.', 'Отправлю фото чуть позже.'],
  // мне ответил покупатель или соискатель
  author: ['Спасибо, понял.', 'А можно посмотреть сегодня?', 'Подскажите, торг возможен?', 'Отлично, договорились!']
}

/** Собеседник, которого нет среди живых пользователей мока, читает и отвечает через несколько секунд */
export function scheduleReply(d: DialogRecord, me: string) {
  const peer = peerIdOf(d, me)
  if (state.users.some(u => u.id === peer && u.id !== demoUser.id) || d.blockedBy.length) return
  const at = Date.now() + 3000 + Math.round(Math.random() * 3000)
  for (const m of d.messages) if (m.authorId === me && !m.readAt) m.readAt = at - 1000
  const pool = REPLIES[d.authorId === me ? 'author' : 'client']
  d.messages.push({ id: `m-${at.toString(36)}`, authorId: peer, text: pool[d.messages.length % pool.length]!, createdAt: at })
}

/** Демо-переписки демо-пользователя: пишет он, пишут ему, заблокированный собеседник */
export function seedChat() {
  const c = chat()
  if (c.seeded) return
  const me = demoUser.id
  const now = Date.now()
  const bySection = (section: string, skip = 0) => seedAds.filter(a => a.section === section)[skip]!
  const msg = (authorId: string, text: string, minutesAgo: number, read = true): MessageRecord =>
    ({ id: `m-seed-${Math.random().toString(36).slice(2, 9)}`, authorId, text, createdAt: now - minutesAgo * MIN, readAt: read ? now - (minutesAgo - 1) * MIN : undefined })

  const realty = bySection('realty', 2)
  const goods = bySection('goods', 3)
  const services = bySection('services', 1)
  const dialogs: DialogRecord[] = [
    {
      id: 'dlg-demo-1', adId: realty.id, authorId: realty.authorId, clientId: me, blockedBy: [],
      messages: [
        msg(me, 'Здравствуйте! Квартира ещё сдаётся?', 2 * 24 * 60),
        msg(realty.authorId, 'Добрый день! Да, свободна с 1 декабря.', 2 * 24 * 60 - 20),
        msg(me, 'Можно посмотреть в субботу?', 90),
        msg(realty.authorId, 'Да, в 12:00 удобно? Адрес пришлю утром.', 45, false)
      ]
    },
    {
      id: 'dlg-demo-2', adId: 'my-1', authorId: me, clientId: 'u-3', blockedBy: [],
      messages: [
        msg('u-3', 'Здравствуйте, вакансия актуальна?', 30, false),
        msg('u-3', 'Есть опыт работы на складе 2 года, иврит базовый.', 29, false)
      ]
    },
    {
      id: 'dlg-demo-3', adId: goods.id, authorId: goods.authorId, clientId: me, blockedBy: [],
      messages: [
        msg(me, 'Добрый вечер, отдадите за 900?', 5 * 24 * 60),
        msg(goods.authorId, 'За 1000 могу, это последняя цена.', 5 * 24 * 60 - 10),
        msg(me, 'Хорошо, заберу завтра.', 5 * 24 * 60 - 5),
        msg(goods.authorId, 'Договорились 👍', 5 * 24 * 60 - 3)
      ]
    },
    {
      id: 'dlg-demo-4', adId: services.id, authorId: services.authorId, clientId: me, blockedBy: [me],
      messages: [
        msg(services.authorId, 'Предоплата 100% на карту, иначе не приеду.', 9 * 24 * 60)
      ]
    }
  ]
  for (const d of dialogs) c.dialogs[d.id] = d
  c.seeded = true
  save()
}
