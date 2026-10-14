import { referencesApi } from '~/api'
import type { RefItem, Section } from '~/types'

/** Источник вариантов выбора для поля формы: ключ кэша и загрузчик; null - зависимость не выбрана */
export type PublishRef = (params: Record<string, unknown>) => { key: string, load: () => Promise<RefItem[]> } | null

interface Base {
  /** Путь в `params` (точка для вложенных, например `rent.longTerm`) */
  key: string
  label: string
  /** Поле скрыто, пока условие не выполнено */
  visible?: (params: Record<string, unknown>) => boolean
  /** Какие поля сбросить при изменении (зависимые списки) */
  resets?: string[]
}

export type PublishField =
  | (Base & { kind: 'select', ref?: PublishRef, options?: { value: string, label: string }[] })
  | (Base & { kind: 'segment', options: { value: string, label: string }[] })
  | (Base & { kind: 'checks', options: string[] })
  | (Base & { kind: 'number', unit?: string })
  | (Base & { kind: 'switch' })
  | (Base & { kind: 'date' })

export interface PublishBlock {
  title: string
  fields: PublishField[]
}

const yn = [{ value: 'true', label: 'Да' }, { value: 'false', label: 'Нет' }]
const str = (p: Record<string, unknown>, k: string) => (typeof p[k] === 'string' ? (p[k] as string) : '')

export const PUBLISH_BLOCKS: Record<Section, PublishBlock[]> = {
  work: [
    {
      title: 'О работе',
      fields: [
        { kind: 'select', key: 'categoryId', label: 'Категория работы', resets: ['positionId'], ref: () => ({ key: 'work.categories', load: referencesApi.workCategories }) },
        { kind: 'select', key: 'positionId', label: 'Должность', ref: p => (str(p, 'categoryId') ? { key: `work.positions:${str(p, 'categoryId')}`, load: () => referencesApi.workPositions(str(p, 'categoryId')) } : null) },
        { kind: 'segment', key: 'hebrew', label: 'Знание иврита', options: [{ value: 'any', label: 'Не важно' }, { value: 'required', label: 'Требуется' }, { value: 'none', label: 'Без иврита' }] },
        { kind: 'checks', key: 'schedule', label: 'Тип графика', options: ['Дневные смены', 'Вечерние смены', 'Ночные смены', 'Гибкий график'] },
        { kind: 'checks', key: 'employment', label: 'Тип занятости', options: ['Полная занятость', 'Частичная занятость', 'Подработка'] },
        { kind: 'checks', key: 'conditions', label: 'Условия', options: ['Подвозка', 'Питание', 'Проживание'] },
        { kind: 'segment', key: 'experience', label: 'Опыт', options: [{ value: 'none', label: 'Без опыта' }, { value: 'required', label: 'Требуется опыт' }] },
        { kind: 'number', key: 'ageLimit', label: 'Ограничение по возрасту, до' }
      ]
    }
  ],
  realty: [
    {
      title: 'Объект',
      fields: [
        { kind: 'segment', key: 'deal', label: 'Тип сделки', options: [{ value: 'rent', label: 'Аренда' }, { value: 'sale', label: 'Продажа' }] },
        { kind: 'select', key: 'category', label: 'Тип объекта', resets: ['type', 'subtype'], ref: () => ({ key: 'realty.categories', load: referencesApi.realtyCategories }) },
        { kind: 'select', key: 'type', label: 'Вид', resets: ['subtype'], ref: p => (str(p, 'category') ? { key: `realty.types:${str(p, 'category')}`, load: () => referencesApi.realtyTypes(str(p, 'category')) } : null) },
        { kind: 'select', key: 'subtype', label: 'Подтип', visible: p => ['apartment', 'house'].includes(str(p, 'type')), ref: p => ({ key: `realty.subtypes:${str(p, 'type')}`, load: () => referencesApi.realtySubtypes(str(p, 'type')) }) },
        { kind: 'segment', key: 'market', label: 'Тип рынка', visible: p => p.deal === 'sale', options: [{ value: 'secondary', label: 'Вторичный' }, { value: 'new', label: 'Новостройка' }] }
      ]
    },
    {
      title: 'Параметры',
      fields: [
        { kind: 'number', key: 'rooms', label: 'Количество комнат' },
        { kind: 'number', key: 'area', label: 'Жилая площадь', unit: 'м2' },
        { kind: 'number', key: 'floor', label: 'Этаж' },
        { kind: 'number', key: 'floors', label: 'Этажей в доме' },
        { kind: 'checks', key: 'features', label: 'Параметры', options: ['Балкон', 'Лифт', 'Парковка', 'Кондиционер', 'Мебель', 'Кладовка', 'После ремонта', 'Мамад'] },
        { kind: 'checks', key: 'extras', label: 'Дополнительные параметры', options: ['Сукка-балкон', 'Вид на море', 'Доступ для инвалидов', 'Солнечный бойлер', 'Крытая парковка', 'Частная парковка'] }
      ]
    },
    {
      title: 'Условия аренды',
      fields: [
        { kind: 'date', key: 'rent.moveInDate', label: 'Дата въезда', visible: p => p.deal !== 'sale' },
        { kind: 'switch', key: 'rent.longTerm', label: 'Долгосрочная аренда', visible: p => p.deal !== 'sale' },
        { kind: 'switch', key: 'rent.daily', label: 'Посуточно', visible: p => p.deal !== 'sale' },
        { kind: 'switch', key: 'rent.sublet', label: 'Саблет', visible: p => p.deal !== 'sale' },
        { kind: 'switch', key: 'rent.pets', label: 'Можно с животными', visible: p => p.deal !== 'sale' },
        { kind: 'switch', key: 'rent.arnona', label: 'Arnona включена', visible: p => p.deal !== 'sale' },
        { kind: 'switch', key: 'rent.vaadBait', label: 'Vaad Bait включён', visible: p => p.deal !== 'sale' }
      ]
    }
  ],
  goods: [
    {
      title: 'О товаре',
      fields: [
        { kind: 'select', key: 'categoryId', label: 'Категория', resets: ['subcategoryId', 'brandId', 'modelId'], ref: () => ({ key: 'goods.categories', load: referencesApi.goodsCategories }) },
        { kind: 'select', key: 'subcategoryId', label: 'Подкатегория', resets: ['brandId', 'modelId'], ref: p => (str(p, 'categoryId') ? { key: `goods.subcategories:${str(p, 'categoryId')}`, load: () => referencesApi.goodsSubcategories(str(p, 'categoryId')) } : null) },
        { kind: 'select', key: 'brandId', label: 'Бренд', resets: ['modelId'], ref: p => (str(p, 'subcategoryId') ? { key: `goods.brands:${str(p, 'subcategoryId')}:`, load: () => referencesApi.goodsBrands(str(p, 'subcategoryId')) } : null) },
        { kind: 'select', key: 'modelId', label: 'Модель', ref: p => (str(p, 'brandId') ? { key: `goods.models:${str(p, 'brandId')}`, load: () => referencesApi.goodsModels([str(p, 'brandId')]) } : null) },
        { kind: 'segment', key: 'condition', label: 'Состояние', options: [{ value: 'used', label: 'Б/У' }, { value: 'new', label: 'Новый' }] },
        { kind: 'checks', key: 'handover', label: 'Формат передачи', options: ['Самовывоз', 'Доставка', 'Встреча'] },
        { kind: 'segment', key: 'bargain', label: 'Торг', options: [{ value: 'true', label: 'Возможен' }, { value: 'false', label: 'Невозможен' }] }
      ]
    }
  ],
  services: [
    {
      title: 'Об услуге',
      fields: [
        { kind: 'select', key: 'categoryId', label: 'Категория', resets: ['subcategoryId'], ref: () => ({ key: 'services.categories', load: referencesApi.servicesCategories }) },
        { kind: 'select', key: 'subcategoryId', label: 'Подкатегория', ref: p => (str(p, 'categoryId') ? { key: `services.subcategories:${str(p, 'categoryId')}`, load: () => referencesApi.servicesSubcategories(str(p, 'categoryId')) } : null) },
        { kind: 'checks', key: 'formats', label: 'Формат работы', options: ['Выезд на дом', 'Онлайн', 'По адресу исполнителя'] },
        { kind: 'segment', key: 'roundTheClock', label: 'Круглосуточно', options: yn }
      ]
    }
  ]
}

/** Периоды цены в форме: работа почасовая или помесячная, недвижимость в месяц */
export const PRICE_PERIODS: Partial<Record<Section, { value: string, label: string }[]>> = {
  work: [{ value: 'hour', label: 'В час' }, { value: 'month', label: 'В месяц' }],
  realty: [{ value: 'month', label: 'В месяц' }]
}
export const PRICE_LABELS: Record<Section, string> = { work: 'Зарплата', realty: 'Стоимость', goods: 'Стоимость', services: 'Цена' }

/** Читает значение по пути с точками */
export function getPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined), obj)
}

/** Возвращает копию объекта с записанным значением по пути с точками */
export function setPath(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const [head, ...rest] = path.split('.')
  if (!rest.length) return { ...obj, [head!]: value }
  const child = (obj[head!] && typeof obj[head!] === 'object' ? obj[head!] : {}) as Record<string, unknown>
  return { ...obj, [head!]: setPath(child, rest.join('.'), value) }
}

/** Значения формы по умолчанию для нового объявления раздела */
export function defaultParams(section: Section): Record<string, unknown> {
  switch (section) {
    case 'work': return { hebrew: 'any', schedule: [], employment: [], conditions: [], experience: 'none' }
    case 'realty': return { deal: 'rent', category: 'residential', type: 'apartment', features: [], extras: [], rent: { longTerm: true } }
    case 'goods': return { condition: 'used', handover: [], bargain: false }
    default: return { formats: [], roundTheClock: false }
  }
}
