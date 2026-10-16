// Защищённые страницы (профиль, подача, избранное): гость остаётся на месте, открывается окно входа,
// после входа он попадает на нужную страницу. При прямом заходе по ссылке открывается главная с окном входа.
export default defineNuxtRouteMiddleware((to, from) => {
  if (useAuthStore().isAuthed) return
  useUiStore().openLogin(to.fullPath)
  return from.matched.length ? abortNavigation() : navigateTo('/')
})
