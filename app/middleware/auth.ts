// Защищённые страницы (профиль, подача, избранное): гость остаётся на месте, открывается окно входа,
// после входа он попадает на нужную страницу. При прямом заходе по ссылке открывается главная с окном входа.
export default defineNuxtRouteMiddleware((to, from) => {
  if (useAuthStore().isAuthed) return
  useUiStore().openLogin(to.fullPath)
  // первая загрузка страницы (прямая ссылка): отмена перехода показала бы 404, поэтому ведём на главную
  const first = import.meta.client && useNuxtApp().isHydrating
  return first || !from.matched.length ? navigateTo('/', { replace: true }) : abortNavigation()
})
