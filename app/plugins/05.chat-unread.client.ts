// Счётчик непрочитанных сообщений для шапки, таббара и меню кабинета: обновляется раз в 30 с, пока пользователь вошёл
export default defineNuxtPlugin(() => {
  const auth = useAuthStore()
  const chat = useChatStore()
  let timer: ReturnType<typeof setInterval> | undefined
  watch(() => auth.isAuthed, (authed) => {
    clearInterval(timer)
    if (!authed) { chat.reset(); return }
    chat.loadUnread()
    timer = setInterval(() => { if (document.visibilityState === 'visible') chat.loadUnread() }, 30_000)
  }, { immediate: true })
})
