import type { FilterState, RefItem, Section } from '~/types'
import { apiFetch } from './client'

export const filtersApi = {
  /** Количество результатов для кнопки «Показать N объявлений» */
  count: (section: Section, filter: Partial<FilterState>, q?: string, signal?: AbortSignal) =>
    apiFetch<{ count: number }>('/filters/count', { query: { section, q, f: JSON.stringify(filter) }, signal })
}

export const referencesApi = {
  workCategories: () => apiFetch<RefItem[]>('/references/work/categories'),
  workPositions: (categoryId: string) => apiFetch<RefItem[]>('/references/work/positions', { query: { categoryId } }),
  realtyCategories: () => apiFetch<RefItem[]>('/references/realty/categories'),
  realtyTypes: (category: string) => apiFetch<RefItem[]>('/references/realty/types', { query: { category } }),
  realtySubtypes: (type: string) => apiFetch<RefItem[]>('/references/realty/subtypes', { query: { type } }),
  realtyProjects: (cityIds: string[]) => apiFetch<RefItem[]>('/references/realty/projects', { query: { cityIds } }),
  realtyDevelopers: (projectIds: string[]) => apiFetch<RefItem[]>('/references/realty/developers', { query: { projectIds } }),
  goodsCategories: () => apiFetch<RefItem[]>('/references/goods/categories'),
  goodsSubcategories: (categoryId: string) => apiFetch<RefItem[]>('/references/goods/subcategories', { query: { categoryId } }),
  goodsBrands: (subcategoryId?: string, categoryId?: string) =>
    apiFetch<RefItem[]>('/references/goods/brands', { query: { subcategoryId, categoryId } }),
  goodsModels: (brandIds: string[]) => apiFetch<RefItem[]>('/references/goods/models', { query: { brandIds } }),
  servicesCategories: () => apiFetch<RefItem[]>('/references/services/categories'),
  servicesSubcategories: (categoryId: string) => apiFetch<RefItem[]>('/references/services/subcategories', { query: { categoryId } })
}
