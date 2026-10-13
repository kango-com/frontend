export interface City {
  id: string
  name: string
  popular?: boolean
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
