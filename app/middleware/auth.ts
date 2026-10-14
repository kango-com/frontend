// Защищённые страницы (профиль, подача, избранное): гость уходит на вход и возвращается после него
export default defineNuxtRouteMiddleware((to) => {
  if (!useAuthStore().isAuthed) return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
})
