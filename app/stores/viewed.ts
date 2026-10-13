import { defineStore } from 'pinia'
import { viewedApi } from '~/api'
import type { AdCard, LoadStatus } from '~/types'
import { useAuthStore } from './auth'

const KEY = 'kango.viewed'
const MAX = 20

export const useViewedStore = defineStore('viewed', () => {
  const items = ref<AdCard[]>([])
  const status = ref<LoadStatus>('idle')

  const readLocal = (): AdCard[] => {
    if (!import.meta.client) return []
    try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { return [] }
  }
  const writeLocal = () => {
    if (import.meta.client) try { localStorage.setItem(KEY, JSON.stringify(items.value)) } catch { /* ignore */ }
  }

  /** Вошедший пользователь: с сервера. Гость: из localStorage */
  async function load() {
    status.value = 'loading'
    if (useAuthStore().isAuthed) {
      try {
        items.value = await viewedApi.list()
        status.value = 'success'
      } catch {
        status.value = 'error'
      }
      return
    }
    items.value = readLocal()
    status.value = 'success'
  }

  async function add(card: AdCard) {
    items.value = [card, ...items.value.filter(i => i.id !== card.id)].slice(0, MAX)
    if (useAuthStore().isAuthed) {
      try { await viewedApi.add(card.id) } catch { /* локальная копия остаётся */ }
    } else {
      writeLocal()
    }
  }

  return { items, status, load, add }
})
