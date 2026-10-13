import { defineStore } from 'pinia'
import { favoritesApi, isApiError } from '~/api'
import type { AdCard, LoadStatus } from '~/types'
import { useAdsStore } from './ads'
import { useAuthStore } from './auth'

export const useFavoritesStore = defineStore('favorites', () => {
  const items = ref<AdCard[]>([])
  const status = ref<LoadStatus>('idle')
  const ids = computed(() => new Set(items.value.map(i => i.id)))
  const isFavorite = (id: string) => ids.value.has(id)

  async function load() {
    if (!useAuthStore().isAuthed) { items.value = []; return }
    status.value = 'loading'
    try {
      items.value = await favoritesApi.list()
      status.value = 'success'
    } catch (e) {
      status.value = 'error'
      if (isApiError(e) && e.status === 401) items.value = []
    }
  }

  /** Возвращает `auth-required`, если пользователь не вошёл: вызывающий ведёт на вход */
  async function toggle(card: AdCard): Promise<'added' | 'removed' | 'auth-required'> {
    if (!useAuthStore().isAuthed) return 'auth-required'
    const ads = useAdsStore()
    if (isFavorite(card.id)) {
      items.value = items.value.filter(i => i.id !== card.id)
      ads.patchFavorite(card.id, false)
      try { await favoritesApi.remove(card.id) } catch { items.value = [card, ...items.value]; ads.patchFavorite(card.id, true) }
      return 'removed'
    }
    items.value = [{ ...card, isFavorite: true }, ...items.value]
    ads.patchFavorite(card.id, true)
    try { await favoritesApi.add(card.id) } catch { items.value = items.value.filter(i => i.id !== card.id); ads.patchFavorite(card.id, false) }
    return 'added'
  }

  function clear() { items.value = [] }

  return { items, status, ids, isFavorite, load, toggle, clear }
})
