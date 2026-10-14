import { defineStore } from 'pinia'
import { adsApi, isApiError } from '~/api'
import type { AdCard, ApiError, LoadStatus } from '~/types'

/** Объявления текущего пользователя (профиль): загрузка и удаление */
export const useMyAdsStore = defineStore('myAds', () => {
  const items = ref<AdCard[]>([])
  const status = ref<LoadStatus>('idle')
  const error = ref<ApiError | null>(null)

  async function load() {
    status.value = 'loading'
    error.value = null
    try {
      items.value = await adsApi.mine()
      status.value = 'success'
    } catch (e) {
      status.value = 'error'
      error.value = isApiError(e) ? e : { status: 0, code: 'unknown', message: tr('Что-то пошло не так') }
    }
  }

  /** Удаление с откатом при ошибке сервера; возвращает, удалось ли */
  async function remove(id: string): Promise<boolean> {
    const before = items.value
    items.value = before.filter(i => i.id !== id)
    try {
      await adsApi.remove(id)
      return true
    } catch {
      items.value = before
      return false
    }
  }

  const reset = () => { items.value = []; status.value = 'idle'; error.value = null }

  return { items, status, error, load, remove, reset }
})
