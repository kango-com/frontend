import type { Section } from './common'

export interface SearchSuggestion {
  id: string
  text: string
  /** «Электроника и телефоны» */
  categoryTitle?: string
  section?: Section
}

export interface SearchHistoryItem {
  id: string
  text: string
  categoryTitle?: string
  /** ISO-дата запроса */
  createdAt: string
}
