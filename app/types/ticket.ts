/** Обращения в поддержку (Договор, Прил. 1, п. 7.3) */
export type TicketStatus = 'new' | 'in_progress' | 'waiting' | 'resolved' | 'closed'
export type TicketCategory = 'ad' | 'account' | 'payment' | 'complaint' | 'other'

export interface TicketAttachment {
  url: string
  name: string
  /** Байты */
  size: number
  type: string
}

export interface TicketMessage {
  id: string
  ticketId: string
  from: 'user' | 'support'
  /** «Поддержка Kango» или имя пользователя */
  authorName: string
  text: string
  attachments: TicketAttachment[]
  /** ISO-дата */
  createdAt: string
}

export interface Ticket {
  id: string
  /** Номер для показа: «№ 10234» */
  number: number
  subject: string
  category: TicketCategory
  status: TicketStatus
  adId?: string
  adTitle?: string
  createdAt: string
  updatedAt: string
  lastMessage?: TicketMessage
  /** Непрочитанные ответы поддержки */
  unread: number
  /** До какой даты решённое обращение можно переоткрыть */
  reopenUntil?: string
}

export interface CreateTicketPayload {
  subject: string
  category: TicketCategory
  text: string
  adId?: string
  attachments: TicketAttachment[]
}
