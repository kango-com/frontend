import type { ChatMessage, Dialog, MessageReportReason } from '~/types'
import { apiFetch } from './client'

/** Внутренний чат по объявлениям */
export const chatApi = {
  list: () => apiFetch<Dialog[]>('/dialogs'),
  /** Открыть (или создать) диалог с автором объявления */
  open: (adId: string) => apiFetch<Dialog>('/dialogs', { method: 'POST', body: { adId } }),
  byId: (id: string) => apiFetch<Dialog>(`/dialogs/${id}`),
  /** Сообщения диалога; `after` - только новее указанного id (для опроса) */
  messages: (id: string, after?: string) => apiFetch<ChatMessage[]>(`/dialogs/${id}/messages`, { query: { after } }),
  send: (id: string, text: string) => apiFetch<ChatMessage>(`/dialogs/${id}/messages`, { method: 'POST', body: { text } }),
  markRead: (id: string) => apiFetch<void>(`/dialogs/${id}/read`, { method: 'POST' }),
  block: (id: string) => apiFetch<Dialog>(`/dialogs/${id}/block`, { method: 'POST' }),
  unblock: (id: string) => apiFetch<Dialog>(`/dialogs/${id}/block`, { method: 'DELETE' }),
  reportMessage: (messageId: string, reason: MessageReportReason, comment?: string) =>
    apiFetch<void>(`/messages/${messageId}/report`, { method: 'POST', body: { reason, comment } }),
  unreadCount: () => apiFetch<{ count: number }>('/dialogs/unread')
}
