import { defineStore } from 'pinia'
import { isApiError, searchApi } from '~/api'
import type { LoadStatus, SearchHistoryItem, SearchSuggestion } from '~/types'
import { useAuthStore } from './auth'

const KEY = 'kango.search.history'
const MAX = 10

/** Запасной список: показывается сразу, до ответа сервера и если он недоступен */
const DEFAULT_POPULAR: SearchSuggestion[] = [
  { id: 'd0', text: 'Квартира в Тель-Авиве', categoryTitle: 'Недвижимость', section: 'realty' },
  { id: 'd1', text: 'Аренда квартиры', categoryTitle: 'Недвижимость', section: 'realty' },
  { id: 'd2', text: 'Диван', categoryTitle: 'Мебель', section: 'goods' },
  { id: 'd3', text: 'Холодильник', categoryTitle: 'Бытовая техника', section: 'goods' },
  { id: 'd4', text: 'Телефоны', categoryTitle: 'Электроника и телефоны', section: 'goods' }
]

export const useSearchStore = defineStore('search', () => {
  const popular = ref<SearchSuggestion[]>(DEFAULT_POPULAR)
  const query = ref('')
  const suggestions = ref<SearchSuggestion[]>([])
  const history = ref<SearchHistoryItem[]>([])
  const status = ref<LoadStatus>('idle')
  let controller: AbortController | null = null

  const readLocal = (): SearchHistoryItem[] => {
    if (!import.meta.client) return []
    try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { return [] }
  }
  const writeLocal = () => {
    if (import.meta.client) try { localStorage.setItem(KEY, JSON.stringify(history.value)) } catch { /* ignore */ }
  }

  /** Подсказки по префиксу; предыдущий запрос отменяется (вызывающий делает дебаунс) */
  async function suggest(q: string) {
    controller?.abort()
    query.value = q
    if (!q.trim()) { suggestions.value = []; status.value = 'idle'; return }
    controller = new AbortController()
    status.value = 'loading'
    try {
      suggestions.value = await searchApi.suggest(q.trim(), controller.signal)
      status.value = 'success'
    } catch (e) {
      if (isApiError(e) && e.code === 'aborted') return
      suggestions.value = []
      status.value = 'error'
    }
  }

  async function loadPopular() {
    try {
      const list = await searchApi.popular()
      if (Array.isArray(list) && list.length) popular.value = list
    } catch { /* остаётся запасной список */ }
  }

  async function loadHistory() {
    if (useAuthStore().isAuthed) {
      try { history.value = await searchApi.history() } catch { history.value = [] }
    } else {
      history.value = readLocal()
    }
  }

  /** Запоминает запрос: на сервере для вошедшего, локально для гостя */
  async function submit(text: string, categoryTitle?: string) {
    const value = text.trim()
    if (!value) return
    query.value = value
    if (useAuthStore().isAuthed) {
      try { await searchApi.saveHistory(value, categoryTitle) } catch { /* история не критична */ }
      await loadHistory()
    } else {
      const item: SearchHistoryItem = { id: `h${Date.now()}`, text: value, categoryTitle, createdAt: new Date().toISOString() }
      history.value = [item, ...history.value.filter(h => h.text !== value)].slice(0, MAX)
      writeLocal()
    }
  }

  async function removeHistory(id: string) {
    history.value = history.value.filter(h => h.id !== id)
    if (useAuthStore().isAuthed) { try { await searchApi.removeHistory(id) } catch { /* ignore */ } } else writeLocal()
  }

  async function clearHistory() {
    history.value = []
    if (useAuthStore().isAuthed) { try { await searchApi.clearHistory() } catch { /* ignore */ } } else writeLocal()
  }

  function reset() {
    controller?.abort()
    query.value = ''
    suggestions.value = []
    status.value = 'idle'
  }

  return { query, suggestions, history, popular, status, suggest, loadPopular, loadHistory, submit, removeHistory, clearHistory, reset }
})
