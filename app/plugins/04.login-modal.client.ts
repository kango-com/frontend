// Переход на /login, /register и /forgot из приложения открывает окно поверх текущей страницы.
// Сами страницы остаются для прямой ссылки и для переходов между экранами внутри них; /reset (ссылка из письма) тоже страница.
const VIEWS = { '/login': 'login', '/register': 'register', '/forgot': 'forgot' } as const
const AUTH_PAGES = ['/login', '/register', '/forgot', '/reset']

export default defineNuxtPlugin(() => {
  const router = useRouter()
  const ui = useUiStore()
  const auth = useAuthStore()

  router.beforeEach((to, from) => {
    const view = VIEWS[to.path as keyof typeof VIEWS]
    if (!view || !from.matched.length) return
    if (auth.isAuthed || AUTH_PAGES.some(p => from.path.startsWith(p))) return
    ui.openAuth(view, typeof to.query.redirect === 'string' ? to.query.redirect : undefined)
    return false
  })
})
