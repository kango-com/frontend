import { defineStore } from 'pinia'

export type SheetName = 'city' | 'sort' | 'filters' | 'search' | 'report' | 'menu' | 'login'

/** Какие шторки, модальные окна и панели открыты (одновременно открыта одна) */
export const useUiStore = defineStore('ui', () => {
  const sheet = ref<SheetName | null>(null)
  /** Куда вести после входа через модалку (пусто: остаться на странице) */
  const loginRedirect = ref<string | null>(null)
  /** Какой экран показывает окно входа */
  const authView = ref<'login' | 'register' | 'forgot'>('login')
  const open = (name: SheetName) => { sheet.value = name }
  const openAuth = (view: 'login' | 'register' | 'forgot' = 'login', redirect?: string | null) => {
    authView.value = view
    loginRedirect.value = redirect ?? null
    sheet.value = 'login'
  }
  const openLogin = (redirect?: string | null) => openAuth('login', redirect)
  const close = (name?: SheetName) => { if (!name || sheet.value === name) sheet.value = null }
  const toggle = (name: SheetName) => { sheet.value = sheet.value === name ? null : name }
  const isOpen = (name: SheetName) => sheet.value === name
  return { sheet, loginRedirect, authView, open, openAuth, openLogin, close, toggle, isOpen }
})
