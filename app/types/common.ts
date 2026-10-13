export type Section = 'work' | 'realty' | 'goods' | 'services'

export const SECTIONS: Section[] = ['work', 'realty', 'goods', 'services']

export interface Pagination<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

/** Единый формат ошибки API (см. docs/api-contract.md) */
export interface ApiError {
  status: number
  code: string
  message: string
  /** Ошибки по полям формы: имя поля -> сообщение */
  fields?: Record<string, string>
}

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error'

export interface RefItem {
  id: string
  title: string
  parentId?: string
}

export interface Coordinates {
  lat: number
  lng: number
}
