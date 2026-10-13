import { defineStore } from 'pinia'
import { filtersApi, isApiError } from '~/api'
import type { FilterOfSection, FilterState, LoadStatus, RefItem, Section } from '~/types'
import { activeFilterCount, defaultFilter, filterFromQuery, filterToQuery } from '~/utils/filters'

export const useFiltersStore = defineStore('filters', () => {
  const state = reactive<{ [S in Section]: FilterOfSection<S> }>({
    work: defaultFilter('work'),
    realty: defaultFilter('realty'),
    goods: defaultFilter('goods'),
    services: defaultFilter('services')
  })
  /** Количество результатов для кнопки «Показать N объявлений» */
  const counts = reactive<Record<Section, number | null>>({ work: null, realty: null, goods: null, services: null })
  const countStatus = ref<LoadStatus>('idle')
  const refs = reactive<Record<string, RefItem[]>>({})
  const refStatus = reactive<Record<string, LoadStatus>>({})
  let countController: AbortController | null = null

  const get = <S extends Section>(section: S) => state[section] as FilterOfSection<S>

  function setField<S extends Section, K extends keyof FilterOfSection<S>>(section: S, key: K, value: FilterOfSection<S>[K]) {
    (state[section] as FilterOfSection<S>)[key] = value
  }

  /** Заменяет фильтр раздела целиком (например, из параметров URL) */
  function replace(section: Section, next: FilterState) {
    (state as Record<Section, FilterState>)[section] = next
  }

  function reset(section: Section) {
    const cityIds = state[section].cityIds
    replace(section, { ...defaultFilter(section), cityIds })
    counts[section] = null
  }

  /** «Весь Израиль» (пустой список) и отдельные города взаимоисключающие */
  function setCities(section: Section, cityIds: string[]) {
    state[section].cityIds = cityIds
  }

  const activeCount = (section: Section) => activeFilterCount(state[section])
  const toQuery = (section: Section) => filterToQuery(state[section])
  const fromQuery = (section: Section, query: Record<string, unknown>) => replace(section, filterFromQuery(section, query))

  /** Подсчёт результатов; предыдущий запрос отменяется (вызывающий делает дебаунс) */
  async function loadCount(section: Section, q?: string) {
    countController?.abort()
    countController = new AbortController()
    countStatus.value = 'loading'
    try {
      counts[section] = (await filtersApi.count(section, state[section], q, countController.signal)).count
      countStatus.value = 'success'
    } catch (e) {
      if (isApiError(e) && e.code === 'aborted') return
      countStatus.value = 'error'
    }
  }

  /** Загрузка справочника с кэшем по ключу (например `work.positions:hospitality`) */
  async function loadRef(key: string, loader: () => Promise<RefItem[]>, force = false) {
    if (refs[key] && !force) return refs[key]
    refStatus[key] = 'loading'
    try {
      refs[key] = await loader()
      refStatus[key] = 'success'
    } catch {
      refStatus[key] = 'error'
      refs[key] = []
    }
    return refs[key]
  }

  return { state, counts, countStatus, refs, refStatus, get, setField, replace, reset, setCities, activeCount, toQuery, fromQuery, loadCount, loadRef }
})
