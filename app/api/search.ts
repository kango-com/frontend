import type { SearchHistoryItem, SearchSuggestion } from '~/types'
import { apiFetch } from './client'

export const searchApi = {
  suggest: (q: string, signal?: AbortSignal) => apiFetch<SearchSuggestion[]>('/search/suggest', { query: { q }, signal }),
  history: () => apiFetch<SearchHistoryItem[]>('/search/history'),
  saveHistory: (text: string, categoryTitle?: string) =>
    apiFetch<SearchHistoryItem>('/search/history', { method: 'POST', body: { text, categoryTitle } }),
  removeHistory: (id: string) => apiFetch<void>(`/search/history/${id}`, { method: 'DELETE' }),
  clearHistory: () => apiFetch<void>('/search/history', { method: 'DELETE' })
}
