import type { Ad, AdCard, AdDraft, AdsQuery, Coordinates, MapAd, MyAd, Pagination, ReportPayload, Section } from '~/types'
import { apiFetch, type ApiQuery } from './client'

/** Параметры списка в query: фильтр передаётся одним JSON-параметром `f` */
export function adsQueryToParams(q: AdsQuery): ApiQuery {
  return {
    section: q.section,
    q: q.q,
    city: q.cityIds,
    sort: q.sort,
    page: q.page,
    limit: q.limit,
    f: q.filter ? JSON.stringify(q.filter) : undefined
  }
}

export const adsApi = {
  list: (q: AdsQuery, signal?: AbortSignal) => apiFetch<Pagination<AdCard>>('/ads', { query: adsQueryToParams(q), signal }),
  recommendations: (cityIds: string[], page = 1, limit = 24) =>
    apiFetch<Pagination<AdCard>>('/ads/recommendations', { query: { city: cityIds, page, limit } }),
  /** Точки для карты по тем же фильтрам, что и список; `area` - нарисованная граница (многоугольник), сервер отдаёт только точки внутри */
  map: (q: AdsQuery, area?: Coordinates[], signal?: AbortSignal) =>
    apiFetch<MapAd[]>('/ads/map', { query: { ...adsQueryToParams(q), page: undefined, limit: undefined, area: area?.length ? area.map(p => `${p.lng.toFixed(5)},${p.lat.toFixed(5)}`).join(';') : undefined }, signal }),
  byId: (id: string) => apiFetch<Ad>(`/ads/${id}`),
  mine: () => apiFetch<MyAd[]>('/me/ads'),
  /** Снять с публикации (автором) */
  hide: (id: string) => apiFetch<MyAd>(`/ads/${id}/hide`, { method: 'POST' }),
  /** Опубликовать снова снятое объявление */
  republish: (id: string) => apiFetch<MyAd>(`/ads/${id}/republish`, { method: 'POST' }),
  create: (draft: AdDraft) => apiFetch<{ id: string }>('/ads', { method: 'POST', body: draft }),
  update: (id: string, patch: Partial<AdDraft>) => apiFetch<Ad>(`/ads/${id}`, { method: 'PATCH', body: patch }),
  remove: (id: string) => apiFetch<void>(`/ads/${id}`, { method: 'DELETE' }),
  report: (id: string, payload: ReportPayload) => apiFetch<void>(`/ads/${id}/report`, { method: 'POST', body: payload }),
  /** Генерация описания по заполненной форме */
  describe: (section: Section, data: Record<string, unknown>) =>
    apiFetch<{ description: string }>('/ads/describe', { method: 'POST', body: { section, data } })
}
