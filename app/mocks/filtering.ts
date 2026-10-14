import type { FilterState, GoodsFilter, RealtyFilter, ServicesFilter, SortKey, WorkFilter } from '~/types'
import type { AdRecord } from './fixtures/ads'

/** Запрос подходит, если каждое слово (с отбрасыванием окончания) встречается в тексте: «телевизоры» находит «телевизор» */
function matchesQuery(text: string, q: string): boolean {
  if (text.includes(q)) return true
  return q.split(/\s+/).filter(Boolean).every((w) => {
    const stem = w.length > 5 ? w.slice(0, w.length - 2) : w
    return text.includes(stem)
  })
}

const hasAll = (have: string[], need: string[]) => need.every(n => have.includes(n))
const hasAny = (have: string[], need: string[]) => !need.length || need.some(n => have.includes(n))
const inRange = (v: number | undefined, from?: number, to?: number) =>
  (from === undefined || (v !== undefined && v >= from)) && (to === undefined || (v !== undefined && v <= to))

function work(ad: AdRecord & { section: 'work' }, f: Partial<WorkFilter>) {
  const p = ad.params
  if (f.categoryId && p.categoryId !== f.categoryId) return false
  if (f.positionIds?.length && !f.positionIds.includes(p.positionId)) return false
  if (f.hebrew && f.hebrew !== 'any' && p.hebrew !== f.hebrew) return false
  if (f.schedule?.length && !hasAny(p.schedule, f.schedule)) return false
  if (f.employment?.length && !hasAny(p.employment, f.employment)) return false
  if (f.conditions?.length && !hasAll(p.conditions, f.conditions)) return false
  if (f.experience && p.experience !== f.experience) return false
  if (f.ageLimit && (!p.ageLimit || p.ageLimit > f.ageLimit)) return false
  return inRange(p.salaryTo, f.priceFrom, undefined) && inRange(p.salaryFrom, undefined, f.priceTo)
}

function realty(ad: AdRecord & { section: 'realty' }, f: Partial<RealtyFilter>) {
  const p = ad.params
  if (f.deal && p.deal !== f.deal) return false
  if (f.category && p.category !== f.category) return false
  if (f.market && p.market !== f.market) return false
  if (f.type && p.type !== f.type) return false
  if (f.subtype && p.subtype !== f.subtype) return false
  if (f.districtIds?.length && !f.districtIds.includes(ad.districtId ?? '')) return false
  if (f.rooms && f.rooms !== 'any') {
    const r = f.rooms === '5+' ? (p.rooms ?? 0) >= 5 : p.rooms === Number(f.rooms)
    if (!r) return false
  }
  if (!inRange(p.area, f.areaFrom, f.areaTo)) return false
  if (!inRange(p.floor, f.floorFrom, f.floorTo)) return false
  if (f.features?.length && !hasAll(p.features, f.features)) return false
  if (f.extras?.length && !hasAll(p.extras, f.extras)) return false
  if (f.projectIds?.length && (!p.projectId || !f.projectIds.includes(p.projectId))) return false
  if (f.developerIds?.length && (!p.developerId || !f.developerIds.includes(p.developerId))) return false
  if (f.moveInBefore && p.rent?.moveInDate && p.rent.moveInDate > f.moveInBefore) return false
  if (f.rent?.length) {
    const have = Object.entries(p.rent ?? {}).filter(([k, v]) => v === true && k !== 'moveInDate').map(([k]) => k)
    if (!hasAll(have, f.rent)) return false
  }
  return true
}

function goods(ad: AdRecord & { section: 'goods' }, f: Partial<GoodsFilter>) {
  const p = ad.params
  if (f.categoryId && p.categoryId !== f.categoryId) return false
  if (f.subcategoryId && p.subcategoryId !== f.subcategoryId) return false
  if (f.brandIds?.length && (!p.brandId || !f.brandIds.includes(p.brandId))) return false
  if (f.modelIds?.length && (!p.modelId || !f.modelIds.includes(p.modelId))) return false
  if (f.condition && p.condition !== f.condition) return false
  if (f.handover?.length && !hasAny(p.handover, f.handover)) return false
  if (f.bargain && (f.bargain === 'possible') !== p.bargain) return false
  return true
}

function services(ad: AdRecord & { section: 'services' }, f: Partial<ServicesFilter>) {
  const p = ad.params
  if (f.categoryId && p.categoryId !== f.categoryId) return false
  if (f.subcategoryId && p.subcategoryId !== f.subcategoryId) return false
  if (f.formats?.length && !hasAny(p.formats, f.formats)) return false
  if (f.districtIds?.length && !f.districtIds.includes(ad.districtId ?? '')) return false
  if (f.roundTheClock && !p.roundTheClock) return false
  return true
}

export interface FilterOptions {
  section?: string
  q?: string
  cityIds: string[]
  filter?: Partial<FilterState>
}

export function filterAds(ads: AdRecord[], opts: FilterOptions): AdRecord[] {
  const q = opts.q?.trim().toLowerCase()
  const f = opts.filter
  return ads.filter((ad) => {
    if (opts.section && ad.section !== opts.section) return false
    if (opts.cityIds.length && !opts.cityIds.includes(ad.cityId)) return false
    if (q && !matchesQuery(`${ad.title} ${ad.description} ${ad.employer ?? ''}`.toLowerCase(), q)) return false
    if (!f) return true
    // общая цена: для работы диапазон относится к зарплате (см. work())
    if (ad.section !== 'work' && !inRange(ad.price.amount, f.priceFrom, f.priceTo)) return false
    if (f.section && f.section !== ad.section) return true
    switch (ad.section) {
      case 'work': return work(ad, f as Partial<WorkFilter>)
      case 'realty': return realty(ad, f as Partial<RealtyFilter>)
      case 'goods': return goods(ad, f as Partial<GoodsFilter>)
      default: return services(ad, f as Partial<ServicesFilter>)
    }
  })
}

export function sortAds(ads: AdRecord[], sort: SortKey = 'default'): AdRecord[] {
  const byDate = (a: AdRecord, b: AdRecord) => b.createdAt.localeCompare(a.createdAt)
  const copy = [...ads]
  switch (sort) {
    case 'date': return copy.sort(byDate)
    case 'cheaper': return copy.sort((a, b) => a.price.amount - b.price.amount)
    case 'expensive': return copy.sort((a, b) => b.price.amount - a.price.amount)
    case 'distance': return copy.sort((a, b) => a.distance - b.distance)
    case 'salary-desc': return copy.sort((a, b) => b.price.amount - a.price.amount)
    case 'salary-asc': return copy.sort((a, b) => a.price.amount - b.price.amount)
    default: return copy.sort((a, b) => Number(!!b.promoted) - Number(!!a.promoted) || byDate(a, b))
  }
}
