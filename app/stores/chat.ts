import { defineStore } from 'pinia'
import { chatApi, isApiError } from '~/api'
import type { ChatMessage, Dialog, LoadStatus, MessageReportReason } from '~/types'

/** Сообщение в ленте диалога: своё может быть ещё в отправке или с ошибкой */
export interface ChatItem extends ChatMessage {
  state?: 'sending' | 'failed'
}

/** Как часто спрашивать сервер о новых сообщениях (до появления веб-сокетов в backend) */
const POLL_MS = 4000

/** Внутренний чат (Договор, Прил. 1, п. 7.2): список диалогов, открытый диалог, отправка, непрочитанные, блокировка, жалоба */
export const useChatStore = defineStore('chat', () => {
  const dialogs = ref<Dialog[]>([])
  const listStatus = ref<LoadStatus>('idle')
  const unreadTotal = ref(0)

  const currentId = ref<string | null>(null)
  const current = ref<Dialog | null>(null)
  const messages = ref<ChatItem[]>([])
  const dialogStatus = ref<LoadStatus>('idle')
  const sendError = ref('')

  let timer: ReturnType<typeof setInterval> | undefined

  const recount = () => { unreadTotal.value = dialogs.value.reduce((n, d) => n + d.unread, 0) }

  async function loadList() {
    if (!dialogs.value.length) listStatus.value = 'loading'
    try {
      dialogs.value = await chatApi.list()
      listStatus.value = 'success'
      recount()
    } catch {
      listStatus.value = 'error'
    }
  }

  /** Счётчик для шапки и таббара: без загрузки всего списка */
  async function loadUnread() {
    try { unreadTotal.value = (await chatApi.unreadCount()).count } catch { /* счётчик не критичен */ }
  }

  /** Диалог по объявлению: существующий или новый; возвращает id или null с текстом ошибки */
  async function openForAd(adId: string): Promise<{ id: string } | { error: string }> {
    try {
      const d = await chatApi.open(adId)
      return { id: d.id }
    } catch (e) {
      return { error: isApiError(e) ? e.message : tr('Не удалось открыть диалог') }
    }
  }

  function patchDialog(d: Dialog) {
    if (currentId.value === d.id) current.value = d
    const i = dialogs.value.findIndex(x => x.id === d.id)
    if (i >= 0) dialogs.value[i] = d
    recount()
  }

  async function markRead() {
    const id = currentId.value
    if (!id || !current.value?.unread) return
    try {
      await chatApi.markRead(id)
      patchDialog({ ...current.value, unread: 0 })
    } catch { /* повторим при следующем опросе */ }
  }

  async function select(id: string) {
    if (currentId.value === id && dialogStatus.value === 'success') return
    stopPolling()
    currentId.value = id
    current.value = dialogs.value.find(d => d.id === id) ?? null
    messages.value = []
    sendError.value = ''
    dialogStatus.value = 'loading'
    try {
      const [d, list] = await Promise.all([chatApi.byId(id), chatApi.messages(id)])
      if (currentId.value !== id) return
      current.value = d
      messages.value = list
      dialogStatus.value = 'success'
      await markRead()
      startPolling()
    } catch {
      if (currentId.value === id) dialogStatus.value = 'error'
    }
  }

  function close() {
    stopPolling()
    currentId.value = null
    current.value = null
    messages.value = []
    dialogStatus.value = 'idle'
  }

  /** Новые сообщения открытого диалога и обновлённый список (непрочитанные в других диалогах) */
  async function poll() {
    const id = currentId.value
    if (!id) return
    try {
      const [all, d] = await Promise.all([chatApi.messages(id), chatApi.byId(id)])
      if (currentId.value !== id) return
      // с сервера - вся лента (новые сообщения и свежие отметки «прочитано»), свои неотправленные остаются в конце
      messages.value = [...all, ...messages.value.filter(m => m.state)]
      patchDialog(d)
      if (d.unread) await markRead()
      loadList()
    } catch { /* сеть пропала - попробуем на следующем шаге */ }
  }

  function startPolling() {
    stopPolling()
    if (import.meta.client) timer = setInterval(poll, POLL_MS)
  }
  function stopPolling() {
    if (timer) clearInterval(timer)
    timer = undefined
  }

  /** Оптимистичная отправка: сообщение сразу в ленте, при ошибке помечается и его можно повторить */
  async function send(text: string, retryId?: string) {
    const id = currentId.value
    const body = text.trim()
    if (!id || !body) return
    sendError.value = ''
    const tempId = retryId ?? `tmp-${Date.now()}`
    const temp: ChatItem = { id: tempId, dialogId: id, authorId: 'me', text: body, createdAt: new Date().toISOString(), read: false, state: 'sending' }
    messages.value = retryId ? messages.value.map(m => (m.id === retryId ? temp : m)) : [...messages.value, temp]
    try {
      const saved = await chatApi.send(id, body)
      // опрос мог уже принести это сообщение с сервера: тогда временное просто убираем
      messages.value = messages.value.some(m => m.id === saved.id)
        ? messages.value.filter(m => m.id !== tempId)
        : messages.value.map(m => (m.id === tempId ? saved : m))
      if (current.value) patchDialog({ ...current.value, lastMessage: saved, updatedAt: saved.createdAt })
      loadList()
    } catch (e) {
      messages.value = messages.value.map(m => (m.id === tempId ? { ...m, state: 'failed' } : m))
      if (isApiError(e) && e.code === 'blocked') {
        sendError.value = e.message
        // статус блокировки мог поменяться у собеседника
        try { patchDialog(await chatApi.byId(id)) } catch { /* ignore */ }
      }
    }
  }

  const removeFailed = (msgId: string) => { messages.value = messages.value.filter(m => m.id !== msgId) }

  async function setBlocked(blocked: boolean): Promise<boolean> {
    const id = currentId.value
    if (!id) return false
    try {
      patchDialog(await (blocked ? chatApi.block(id) : chatApi.unblock(id)))
      return true
    } catch {
      return false
    }
  }

  async function report(messageId: string, reason: MessageReportReason, comment?: string) {
    await chatApi.reportMessage(messageId, reason, comment)
  }

  function reset() {
    close()
    dialogs.value = []
    listStatus.value = 'idle'
    unreadTotal.value = 0
  }

  return {
    dialogs, listStatus, unreadTotal, currentId, current, messages, dialogStatus, sendError,
    loadList, loadUnread, openForAd, select, close, poll, send, removeFailed, setBlocked, report, reset
  }
})
