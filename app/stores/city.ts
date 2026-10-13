import { defineStore } from 'pinia'
import { geoApi } from '~/api'
import type { City, LoadStatus } from '~/types'

const DEFAULT_CITY: City = { id: 'tel-aviv', name: 'Тель-Авив' }

export const useCityStore = defineStore('city', () => {
  /** Выбранный город хранится в cookie, чтобы выбор переживал перезагрузку и был виден при SSR */
  const saved = useCookie<City | null>('kango_city', { maxAge: 60 * 60 * 24 * 365, sameSite: 'lax', default: () => null })
  const current = ref<City>(saved.value ?? DEFAULT_CITY)
  const popular = ref<City[]>([])
  const results = ref<City[]>([])
  const status = ref<LoadStatus>('idle')
  const searching = ref(false)
  let controller: AbortController | null = null

  const cityIds = computed(() => [current.value.id])

  async function loadPopular() {
    if (popular.value.length) return
    status.value = 'loading'
    try {
      popular.value = await geoApi.popularCities()
      status.value = 'success'
    } catch {
      status.value = 'error'
    }
  }

  /** Поиск по городам; предыдущий запрос отменяется */
  async function search(q: string) {
    controller?.abort()
    controller = new AbortController()
    searching.value = true
    try {
      results.value = await geoApi.cities(q, 60, controller.signal)
    } catch (e) {
      if ((e as { code?: string }).code !== 'aborted') results.value = []
    } finally {
      searching.value = false
    }
  }

  function select(city: City) {
    current.value = city
    saved.value = city
  }

  /** Чипы на главной: популярные города, выбранный первым, если его нет среди популярных */
  const chips = computed<City[]>(() => {
    const rest = popular.value.filter(c => c.id !== current.value.id)
    return [current.value, ...rest].slice(0, 12)
  })

  return { current, popular, results, status, searching, cityIds, chips, loadPopular, search, select }
})
