import { defineStore } from 'pinia'

export type SheetName = 'city' | 'sort' | 'filters' | 'search' | 'report' | 'menu'

/** Какие шторки, модальные окна и панели открыты (одновременно открыта одна) */
export const useUiStore = defineStore('ui', () => {
  const sheet = ref<SheetName | null>(null)
  const open = (name: SheetName) => { sheet.value = name }
  const close = (name?: SheetName) => { if (!name || sheet.value === name) sheet.value = null }
  const toggle = (name: SheetName) => { sheet.value = sheet.value === name ? null : name }
  const isOpen = (name: SheetName) => sheet.value === name
  return { sheet, open, close, toggle, isOpen }
})
