import type { Coordinates } from './common'

export interface City {
  id: string
  name: string
  popular?: boolean
  /** Центр города (карта, «Весь Израиль» не имеет координат) */
  coordinates?: Coordinates
}

export interface District {
  id: string
  cityId: string
  name: string
}

export interface SectionInfo {
  id: import('./common').Section
  title: string
  /** Количество объявлений в выбранном городе */
  count: number
}
