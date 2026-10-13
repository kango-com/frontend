import { defineStore } from 'pinia'
import type { SortKey } from '~/types'
import { sortButtonLabel } from '~/utils/filters'

export const useSortStore = defineStore('sort', () => {
  const current = ref<SortKey>('default')
  /** Подпись кнопки: при значении по умолчанию «Сортировка» */
  const label = computed(() => sortButtonLabel(current.value))
  const set = (value: SortKey) => { current.value = value }
  const reset = () => { current.value = 'default' }
  return { current, label, set, reset }
})
