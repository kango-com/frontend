import type { City, District, RefItem, SectionInfo } from '~/types'
import { apiFetch } from './client'

export const geoApi = {
  cities: (q = '', limit = 50, signal?: AbortSignal) => apiFetch<City[]>('/cities', { query: { q, limit }, signal }),
  popularCities: () => apiFetch<City[]>('/cities/popular'),
  districts: (cityIds: string[]) => apiFetch<District[]>('/districts', { query: { cityIds } }),
  streets: (cityIds: string[], districtIds: string[], q = '') => apiFetch<RefItem[]>('/streets', { query: { cityIds, districtIds, q } }),
  sections: (cityIds: string[] = []) => apiFetch<SectionInfo[]>('/sections', { query: { city: cityIds } })
}
