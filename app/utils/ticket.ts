import type { TicketCategory, TicketStatus } from '~/types'

/** Статусы обращений (Договор, Прил. 1, п. 7.3). Подписи - русские ключи словаря */
export type TicketTone = 'new' | 'work' | 'wait' | 'done' | 'closed'
export const TICKET_STATUS: Record<TicketStatus, { label: string, tone: TicketTone }> = {
  new: { label: 'Новое', tone: 'new' },
  in_progress: { label: 'В работе', tone: 'work' },
  waiting: { label: 'Ожидает вашего ответа', tone: 'wait' },
  resolved: { label: 'Решено', tone: 'done' },
  closed: { label: 'Закрыто', tone: 'closed' }
}

export const TICKET_CATEGORIES: { value: TicketCategory, label: string }[] = [
  { value: 'ad', label: 'Объявление' },
  { value: 'account', label: 'Аккаунт' },
  { value: 'payment', label: 'Оплата' },
  { value: 'complaint', label: 'Жалоба' },
  { value: 'other', label: 'Другое' }
]

export const categoryLabel = (c: TicketCategory) => TICKET_CATEGORIES.find(x => x.value === c)?.label ?? c

/** Обращение ещё в работе: можно писать */
export const isOpenTicket = (s: TicketStatus) => s !== 'resolved' && s !== 'closed'

export const TICKET_MAX_FILES = 3
export const TICKET_MAX_FILE_BYTES = 2 * 1024 * 1024
