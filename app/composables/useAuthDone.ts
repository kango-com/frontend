import { safeRedirect } from '~/utils/password'

/** Что делать после успешного входа или регистрации: в модалке закрыть окно и перейти по сохранённому адресу, на странице перейти по `redirect` */
export function useAuthDone(modal: () => boolean | undefined) {
  const ui = useUiStore()
  const route = useRoute()
  const router = useRouter()
  return async () => {
    if (!modal()) { await router.push(safeRedirect(route.query.redirect)); return }
    const target = ui.loginRedirect
    ui.close('login')
    ui.loginRedirect = null
    if (target && target !== route.fullPath) await router.push(safeRedirect(target))
  }
}
