import type { CreateTicketPayload, Ticket, TicketAttachment, TicketMessage } from '~/types'
import { apiFetch } from './client'

/** Обращения в поддержку (тикеты) */
export const supportApi = {
  list: () => apiFetch<Ticket[]>('/tickets'),
  byId: (id: string) => apiFetch<Ticket>(`/tickets/${id}`),
  messages: (id: string) => apiFetch<TicketMessage[]>(`/tickets/${id}/messages`),
  create: (payload: CreateTicketPayload) => apiFetch<Ticket>('/tickets', { method: 'POST', body: payload }),
  reply: (id: string, text: string, attachments: TicketAttachment[]) =>
    apiFetch<TicketMessage>(`/tickets/${id}/messages`, { method: 'POST', body: { text, attachments } }),
  markRead: (id: string) => apiFetch<void>(`/tickets/${id}/read`, { method: 'POST' }),
  /** Пользователь подтверждает, что вопрос решён */
  resolve: (id: string) => apiFetch<Ticket>(`/tickets/${id}/resolve`, { method: 'POST' }),
  reopen: (id: string) => apiFetch<Ticket>(`/tickets/${id}/reopen`, { method: 'POST' }),
  unreadCount: () => apiFetch<{ count: number }>('/tickets/unread')
}
