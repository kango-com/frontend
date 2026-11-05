// Счётчики непрочитанного для шапки, таббара и меню кабинета (сообщения чата и ответы поддержки): раз в 30 с, пока пользователь вошёл
export default defineNuxtPlugin(() => {
  const auth = useAuthStore()
  const chat = useChatStore()
  const support = useSupportStore()
  let timer: ReturnType<typeof setInterval> | undefined
  watch(() => auth.isAuthed, (authed) => {
    clearInterval(timer)
    if (!authed) { chat.reset(); support.reset(); return }
    chat.loadUnread()
    support.loadUnread()
    timer = setInterval(() => {
      if (document.visibilityState !== 'visible') return
      chat.loadUnread()
      support.loadUnread()
    }, 30_000)
  }, { immediate: true })
})
