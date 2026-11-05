import type { Coordinates, Section } from './common'

export type PricePeriod = 'hour' | 'week' | 'month' | 'day' | 'shift' | 'total'

export interface Price {
  amount: number
  currency: 'ILS'
  period?: PricePeriod
  /** «от 50 ₪» */
  from?: boolean
}

/** Краткая карточка объявления для лент и списков */
export interface AdCard {
  id: string
  section: Section
  title: string
  price: Price
  /** «Тель-Авив, центр» */
  location: string
  image?: string
  /** ISO-дата публикации */
  createdAt: string
  /** Короткие теги карточки («Дневные смены», «Без опыта») */
  tags?: string[]
  /** Работодатель (работа) */
  employer?: string
  isFavorite?: boolean
  promoted?: boolean
  highlighted?: boolean
}

/** Статус объявления (ТЗ п. 5); `deleted` - мягкое удаление, автору не показывается */
export type AdStatus = 'moderation' | 'active' | 'rejected' | 'hidden' | 'deleted'

/** Объявление в кабинете автора: карточка плюс статус, просмотры и сроки */
export interface MyAd extends AdCard {
  status: AdStatus
  /** Причина отклонения или скрытия администратором */
  rejectReason?: string
  views: number
  /** ISO-дата окончания текущего срока публикации (продлевается автоматически) */
  expiresAt?: string
  /** ISO-даты окончания платных опций */
  promotedUntil?: string
  highlightedUntil?: string
}

export interface Contacts {
  phone?: string
  whatsapp?: string
  telegram?: string
}

export interface AdAuthor {
  id: string
  name: string
  online: boolean
  /** ISO-дата регистрации автора */
  since: string
}

export type Hebrew = 'any' | 'required' | 'none'
export type Experience = 'required' | 'none'

export interface WorkParams {
  categoryId: string
  positionId: string
  hebrew: Hebrew
  schedule: string[]
  employment: string[]
  conditions: string[]
  experience: Experience
  ageLimit?: number
  salaryFrom?: number
  salaryTo?: number
}

export interface RentTerms {
  moveInDate?: string
  longTerm?: boolean
  daily?: boolean
  sublet?: boolean
  pets?: boolean
  arnona?: boolean
  vaadBait?: boolean
}

export interface RealtyParams {
  deal: 'rent' | 'sale'
  category: string
  market?: 'secondary' | 'new'
  type: string
  subtype?: string
  rooms?: number
  area?: number
  floor?: number
  floors?: number
  bathrooms?: number
  features: string[]
  extras: string[]
  rent?: RentTerms
  projectId?: string
  developerId?: string
}

export interface GoodsParams {
  categoryId: string
  subcategoryId?: string
  brandId?: string
  modelId?: string
  condition: 'used' | 'new'
  handover: string[]
  bargain: boolean
  gender?: string
  age?: string
  size?: string
}

export interface ServiceParams {
  categoryId: string
  subcategoryId?: string
  formats: string[]
  roundTheClock: boolean
}

interface AdBase extends AdCard {
  /** Номер объявления для показа («№ 874539745») */
  number: number
  description: string
  images: string[]
  contacts: Contacts
  author: AdAuthor
  city: string
  district?: string
  address?: string
  coordinates?: Coordinates
  /** Автор скрыл точное положение: на карте показывается приблизительная область (Договор, Прил. 1, п. 4.2, 9) */
  hideExactLocation?: boolean
}

export interface WorkAd extends AdBase { section: 'work', params: WorkParams }
export interface RealtyAd extends AdBase { section: 'realty', params: RealtyParams }
export interface GoodsAd extends AdBase { section: 'goods', params: GoodsParams }
export interface ServiceAd extends AdBase { section: 'services', params: ServiceParams }

export type Ad = WorkAd | RealtyAd | GoodsAd | ServiceAd

/** Тело создания объявления (черновик подачи) */
export type AdDraft =
  | Omit<WorkAd, 'id' | 'number' | 'createdAt' | 'author' | 'images'> & { images: string[] }
  | Omit<RealtyAd, 'id' | 'number' | 'createdAt' | 'author' | 'images'> & { images: string[] }
  | Omit<GoodsAd, 'id' | 'number' | 'createdAt' | 'author' | 'images'> & { images: string[] }
  | Omit<ServiceAd, 'id' | 'number' | 'createdAt' | 'author' | 'images'> & { images: string[] }

export type ReportReason = 'spam' | 'fraud' | 'wrong-section' | 'prohibited' | 'other'

export interface ReportPayload {
  reason: ReportReason
  comment?: string
}

/** Объявление на карте: карточка плюс точка (Договор, Прил. 1, п. 9 «Карта в выдаче») */
export interface MapAd extends AdCard {
  coordinates: Coordinates
  /** Автор скрыл точный адрес: точка - центр приблизительной области */
  approximate?: boolean
}
