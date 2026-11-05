import { defineStore } from 'pinia'
import { profileApi } from '~/api'
import type { LoadStatus, Purchase } from '~/types'

/** Платные услуги пользователя: история операций и действующие опции */
export const usePurchasesStore = defineStore('purchases', () => {
  const items = ref<Purchase[]>([])
  const status = ref<LoadStatus>('idle')

  /** Действующие опции: оплачены и срок ещё не истёк */
  const active = computed(() => items.value.filter(p => p.status === 'paid' && p.activeUntil && new Date(p.activeUntil).getTime() > Date.now()))

  async function load() {
    status.value = 'loading'
    try {
      items.value = await profileApi.purchases()
      status.value = 'success'
    } catch {
      status.value = 'error'
    }
  }

  const reset = () => { items.value = []; status.value = 'idle' }

  return { items, status, active, load, reset }
})
