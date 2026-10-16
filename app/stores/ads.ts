import { defineStore } from 'pinia'
import { adsApi, isApiError } from '~/api'
import type { Ad, AdCard, AdsQuery, ApiError, LoadStatus, ReportPayload } from '~/types'

export interface Feed {
  items: AdCard[]
  total: number
  page: number
  hasMore: boolean
  status: LoadStatus
  error: ApiError | null
}

const emptyFeed = (): Feed => ({ items: [], total: 0, page: 0, hasMore: false, status: 'idle', error: null })
const LIMIT = 24

export const useAdsStore = defineStore('ads', () => {
  /** Ленты по ключу: `recommendations`, либо ключ запроса списка (раздел, поиск, фильтры) */
  const feeds = reactive<Record<string, Feed>>({})
  const details = reactive<Record<string, Ad>>({})
  const detailStatus = ref<LoadStatus>('idle')
  const detailError = ref<ApiError | null>(null)
  const controllers = new Map<string, AbortController>()

  // Возвращаем реактивный объект из `feeds`, а не только что созданный сырой (иначе подписчики не обновятся)
const feed = (key: string): Feed => {
    if (!feeds[key]) feeds[key] = emptyFeed()
    return feeds[key]!
  }

  async function fetchPage(key: string, request: (page: number, signal: AbortSignal) => Promise<{ items: AdCard[], total: number, hasMore: boolean, page: number }>, reset: boolean) {
    const f = feed(key)
    if (f.status === 'loading' && !reset) return
    controllers.get(key)?.abort()
    const controller = new AbortController()
    controllers.set(key, controller)
    if (reset) Object.assign(f, emptyFeed())
    f.status = 'loading'
    f.error = null
    try {
      const nextPage = reset ? 1 : f.page + 1
      const result = await request(nextPage, controller.signal)
      const items = Array.isArray(result?.items) ? result.items : []
      f.items = reset ? items : [...f.items, ...items]
      f.total = result?.total ?? f.items.length
      f.page = result?.page ?? nextPage
      f.hasMore = !!result?.hasMore
      f.status = 'success'
    } catch (e) {
      if (isApiError(e) && e.code === 'aborted') return
      f.status = 'error'
      f.error = isApiError(e) ? e : { status: 0, code: 'unknown', message: tr('Что-то пошло не так') }
    }
  }

  /** Лента рекомендаций (главная) */
  const loadRecommendations = (cityIds: string[], reset = true) =>
    fetchPage('recommendations', page => adsApi.recommendations(cityIds, page, LIMIT), reset)
  const loadMoreRecommendations = (cityIds: string[]) => loadRecommendations(cityIds, false)

  /** Список по запросу (раздел, поиск, фильтры); ключ строится из параметров */
  const queryKey = (q: AdsQuery) => `list:${JSON.stringify({ ...q, page: undefined, limit: undefined })}`
  function loadList(query: AdsQuery, reset = true) {
    const key = queryKey(query)
    return fetchPage(key, (page, signal) => adsApi.list({ ...query, page, limit: LIMIT }, signal), reset).then(() => key)
  }
  const loadMoreList = (query: AdsQuery) => loadList(query, false)

  async function loadDetails(id: string) {
    detailStatus.value = 'loading'
    detailError.value = null
    try {
      details[id] = await adsApi.byId(id)
      detailStatus.value = 'success'
      return details[id]
    } catch (e) {
      detailStatus.value = 'error'
      detailError.value = isApiError(e) ? e : { status: 0, code: 'unknown', message: tr('Что-то пошло не так') }
      return undefined
    }
  }

  const report = (id: string, payload: ReportPayload) => adsApi.report(id, payload)

  /** Синхронизирует сердечко во всех загруженных лентах */
  function patchFavorite(id: string, value: boolean) {
    for (const f of Object.values(feeds)) {
      for (const item of f.items) if (item.id === id) item.isFavorite = value
    }
  }

  function reset() {
    for (const k of Object.keys(feeds)) delete feeds[k]
  }

  return { feeds, details, detailStatus, detailError, feed, loadRecommendations, loadMoreRecommendations, loadList, loadMoreList, queryKey, loadDetails, report, patchFavorite, reset }
})
