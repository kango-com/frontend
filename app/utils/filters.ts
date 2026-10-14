import type { FilterOfSection, FilterState, Section, SortKey } from '~/types'

/** Значения фильтра по умолчанию для каждого раздела */
export function defaultFilter<S extends Section>(section: S): FilterOfSection<S>
export function defaultFilter(section: Section): FilterState {
  const base = { cityIds: [] as string[], sort: 'default' as SortKey }
  switch (section) {
    case 'work':
      return { ...base, section, mode: 'seek-job', positionIds: [], hebrew: 'any', schedule: [], employment: [], conditions: [] }
    case 'realty':
      return {
        ...base, section, deal: 'rent', category: 'residential', type: 'apartment',
        districtIds: [], streetIds: [], features: [], extras: [], projectIds: [], developerIds: [], rent: []
      }
    case 'goods':
      return { ...base, section, brandIds: [], modelIds: [], handover: [] }
    default:
      return { ...base, section: 'services', formats: [], districtIds: [], roundTheClock: false }
  }
}

type Rec = Record<string, unknown>

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

/** Поля, отличающиеся от значений по умолчанию (без сортировки): их показывает счётчик активных фильтров */
export function changedFields(filter: FilterState): string[] {
  const def = defaultFilter(filter.section) as unknown as Rec
  const cur = filter as unknown as Rec
  return Object.keys(cur).filter(k => k !== 'section' && k !== 'sort' && !same(cur[k], def[k]) && cur[k] !== undefined)
}

export const activeFilterCount = (filter: FilterState) => changedFields(filter).length

/** Фильтр в параметры URL: только изменённые поля, массивы через запятую */
export function filterToQuery(filter: FilterState): Record<string, string> {
  const out: Record<string, string> = {}
  const cur = filter as unknown as Rec
  for (const key of changedFields(filter)) {
    const v = cur[key]
    out[key] = Array.isArray(v) ? v.join(',') : typeof v === 'boolean' ? (v ? '1' : '0') : String(v)
  }
  if (filter.sort !== 'default') out.sort = filter.sort
  return out
}

/** Параметры URL обратно в фильтр раздела (тип значения берётся из значения по умолчанию) */
export function filterFromQuery(section: Section, query: Record<string, unknown>): FilterState {
  const def = defaultFilter(section) as unknown as Rec
  const out: Rec = { ...def }
  const numericFields = new Set(['priceFrom', 'priceTo', 'areaFrom', 'areaTo', 'floorFrom', 'floorTo', 'ageLimit'])
  for (const [key, raw] of Object.entries(query)) {
    if (typeof raw !== 'string' || raw === '') continue
    if (key === 'sort') { out.sort = raw; continue }
    if (!(key in def) && !numericFields.has(key) && !['categoryId', 'subcategoryId', 'subtype', 'market', 'rooms', 'condition', 'bargain', 'gender', 'age', 'size', 'experience', 'salaryPeriod', 'moveInBefore'].includes(key)) continue
    const d = def[key]
    if (Array.isArray(d)) out[key] = raw.split(',').filter(Boolean)
    else if (typeof d === 'boolean') out[key] = raw === '1'
    else if (numericFields.has(key)) out[key] = Number(raw)
    else out[key] = raw
  }
  return out as unknown as FilterState
}

export const SORT_LABELS: Record<SortKey, string> = {
  'default': 'По умолчанию',
  'date': 'По дате',
  'cheaper': 'Дешевле',
  'expensive': 'Дороже',
  'distance': 'По удалённости',
  'salary-desc': 'По убыванию зарплаты',
  'salary-asc': 'По возрастанию зарплаты'
}

/** Доступные сортировки раздела (для «Работы» зарплата вместо удалённости) */
export function sortsFor(section: Section): SortKey[] {
  return section === 'work'
    ? ['default', 'date', 'salary-desc', 'salary-asc']
    : ['default', 'date', 'cheaper', 'expensive', 'distance']
}

/** Подпись кнопки сортировки: при значении по умолчанию «Сортировка» */
export const sortButtonLabel = (sort: SortKey) => (sort === 'default' ? 'Сортировка' : SORT_LABELS[sort])

/** Значение поля по умолчанию (для сброса зависимых полей) */
export function defaultValue(section: Section, key: string): unknown {
  return (defaultFilter(section) as unknown as Record<string, unknown>)[key]
}
