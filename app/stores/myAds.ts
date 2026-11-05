import { defineStore } from 'pinia'
import { adsApi, isApiError } from '~/api'
import type { AdStatus, ApiError, LoadStatus, MyAd } from '~/types'

/** Вкладки «Моих объявлений» (ТЗ п. 7.1) */
export type MyAdsTab = Exclude<AdStatus, 'deleted'>
export const MY_ADS_TABS: MyAdsTab[] = ['active', 'moderation', 'rejected', 'hidden']

/** Объявления текущего пользователя (кабинет): загрузка, снятие, повторная публикация, удаление */
export const useMyAdsStore = defineStore('myAds', () => {
  const items = ref<MyAd[]>([])
  const status = ref<LoadStatus>('idle')
  const error = ref<ApiError | null>(null)

  const counts = computed(() => {
    const c: Record<MyAdsTab, number> = { active: 0, moderation: 0, rejected: 0, hidden: 0 }
    for (const ad of items.value) if (ad.status in c) c[ad.status as MyAdsTab]++
    return c
  })
  const byStatus = (s: MyAdsTab) => items.value.filter(a => a.status === s)

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

  const replace = (ad: MyAd) => { items.value = items.value.map(i => (i.id === ad.id ? ad : i)) }

  /** Действие над объявлением: обновлённая запись приходит с сервера; возвращает, удалось ли */
  async function act(id: string, fn: (id: string) => Promise<MyAd>): Promise<boolean> {
    try {
      replace(await fn(id))
      return true
    } catch {
      return false
    }
  }

  const hide = (id: string) => act(id, adsApi.hide)
  const republish = (id: string) => act(id, adsApi.republish)

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

  return { items, status, error, counts, byStatus, load, hide, republish, remove, reset }
})
