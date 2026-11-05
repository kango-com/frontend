import { defineStore } from 'pinia'
import { isApiError, supportApi } from '~/api'
import type { CreateTicketPayload, LoadStatus, Ticket, TicketAttachment, TicketMessage } from '~/types'

/** Пока обращение открыто, ответ поддержки проверяется раз в 5 с (до веб-сокетов в backend) */
const POLL_MS = 5000

/** Обращения в поддержку (Договор, Прил. 1, п. 7.3): список, открытое обращение, ответ, решение, переоткрытие */
export const useSupportStore = defineStore('support', () => {
  const tickets = ref<Ticket[]>([])
  const listStatus = ref<LoadStatus>('idle')
  const unreadTotal = ref(0)

  const current = ref<Ticket | null>(null)
  const messages = ref<TicketMessage[]>([])
  const ticketStatus = ref<LoadStatus>('idle')
  let timer: ReturnType<typeof setInterval> | undefined

  const recount = () => { unreadTotal.value = tickets.value.reduce((n, t) => n + t.unread, 0) }
  const fail = (e: unknown) => (isApiError(e) ? e.message : tr('Что-то пошло не так'))

  async function loadList() {
    if (!tickets.value.length) listStatus.value = 'loading'
    try {
      tickets.value = await supportApi.list()
      listStatus.value = 'success'
      recount()
    } catch {
      listStatus.value = 'error'
    }
  }

  async function loadUnread() {
    try { unreadTotal.value = (await supportApi.unreadCount()).count } catch { /* счётчик не критичен */ }
  }

  function patch(t: Ticket) {
    if (current.value?.id === t.id) current.value = t
    const i = tickets.value.findIndex(x => x.id === t.id)
    if (i >= 0) tickets.value[i] = t
    else tickets.value.unshift(t)
    recount()
  }

  async function refresh(id: string) {
    const [t, list] = await Promise.all([supportApi.byId(id), supportApi.messages(id)])
    if (current.value && current.value.id !== id) return
    messages.value = list
    if (t.unread) {
      await supportApi.markRead(id)
      t.unread = 0
    }
    patch(t)
  }

  async function open(id: string) {
    stop()
    current.value = tickets.value.find(t => t.id === id) ?? null
    messages.value = []
    ticketStatus.value = 'loading'
    try {
      await refresh(id)
      ticketStatus.value = 'success'
      if (import.meta.client) timer = setInterval(() => refresh(id).catch(() => {}), POLL_MS)
    } catch {
      ticketStatus.value = 'error'
    }
  }

  function stop() {
    if (timer) clearInterval(timer)
    timer = undefined
  }

  function close() {
    stop()
    current.value = null
    messages.value = []
    ticketStatus.value = 'idle'
  }

  /** Создать обращение; возвращает id или ошибки полей */
  async function create(payload: CreateTicketPayload): Promise<{ id: string } | { error: string, fields?: Record<string, string> }> {
    try {
      const t = await supportApi.create(payload)
      patch(t)
      return { id: t.id }
    } catch (e) {
      return { error: fail(e), fields: isApiError(e) ? e.fields : undefined }
    }
  }

  async function reply(text: string, attachments: TicketAttachment[]): Promise<string | null> {
    const id = current.value?.id
    if (!id) return null
    try {
      const m = await supportApi.reply(id, text, attachments)
      messages.value = [...messages.value, m]
      patch(await supportApi.byId(id))
      return null
    } catch (e) {
      return fail(e)
    }
  }

  async function setResolved(resolved: boolean): Promise<string | null> {
    const id = current.value?.id
    if (!id) return null
    try {
      patch(await (resolved ? supportApi.resolve(id) : supportApi.reopen(id)))
      return null
    } catch (e) {
      return fail(e)
    }
  }

  function reset() {
    close()
    tickets.value = []
    listStatus.value = 'idle'
    unreadTotal.value = 0
  }

  return { tickets, listStatus, unreadTotal, current, messages, ticketStatus, loadList, loadUnread, open, close, create, reply, setResolved, reset }
})
