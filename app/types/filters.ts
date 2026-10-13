import type { Hebrew, Experience, PricePeriod } from './ad'
import type { Section } from './common'

export type SortKey = 'default' | 'date' | 'cheaper' | 'expensive' | 'distance' | 'salary-desc' | 'salary-asc'

interface BaseFilter {
  /** Пусто = «Весь Израиль» */
  cityIds: string[]
  priceFrom?: number
  priceTo?: number
  sort: SortKey
}

export interface WorkFilter extends BaseFilter {
  section: 'work'
  mode: 'seek-job' | 'seek-employee'
  categoryId?: string
  positionIds: string[]
  hebrew: Hebrew
  schedule: string[]
  employment: string[]
  salaryPeriod?: PricePeriod
  conditions: string[]
  experience?: Experience
  ageLimit?: number
}

export interface RealtyFilter extends BaseFilter {
  section: 'realty'
  deal: 'rent' | 'sale'
  category: string
  market?: 'secondary' | 'new'
  type: string
  subtype?: string
  districtIds: string[]
  streetIds: string[]
  rooms?: string
  areaFrom?: number
  areaTo?: number
  floorFrom?: number
  floorTo?: number
  features: string[]
  extras: string[]
  projectIds: string[]
  developerIds: string[]
  moveInBefore?: string
  rent: string[]
}

export interface GoodsFilter extends BaseFilter {
  section: 'goods'
  categoryId?: string
  subcategoryId?: string
  brandIds: string[]
  modelIds: string[]
  condition?: 'used' | 'new'
  handover: string[]
  bargain?: 'possible' | 'impossible'
  gender?: string
  age?: string
  size?: string
}

export interface ServicesFilter extends BaseFilter {
  section: 'services'
  categoryId?: string
  subcategoryId?: string
  formats: string[]
  districtIds: string[]
  roundTheClock: boolean
}

export type FilterState = WorkFilter | RealtyFilter | GoodsFilter | ServicesFilter

export type FilterOfSection<S extends Section> = Extract<FilterState, { section: S }>

/** Параметры списка объявлений (см. GET /api/ads) */
export interface AdsQuery {
  section?: Section
  q?: string
  cityIds?: string[]
  sort?: SortKey
  page?: number
  limit?: number
  filter?: Partial<FilterState>
}
