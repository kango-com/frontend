import type { Ad, Price, Section } from '~/types'
import { formatDateRu, formatNumber } from './format'

const nbsp = ' '

const PERIOD_LONG: Record<NonNullable<Price['period']>, string> = {
  hour: 'в час', week: 'в неделю', month: 'в месяц', day: 'в сутки', shift: 'за смену', total: ''
}

/** Цена для страницы объявления: «5 500 ₪ в месяц», «от 50 ₪» */
export function formatPriceLong(price: Price): string {
  const period = price.period ? PERIOD_LONG[price.period] : ''
  return `${price.from ? 'от ' : ''}${formatNumber(price.amount)}${nbsp}₪${period ? ` ${period}` : ''}`
}

const SECTION_TITLES: Record<Section, string> = { work: 'Работа', realty: 'Недвижимость', goods: 'Товары', services: 'Услуги' }
const REALTY_TYPES: Record<string, string> = {
  'apartment': 'Квартира', 'house': 'Дом', 'studio': 'Студия', 'room': 'Комната', 'office': 'Офис', 'shop': 'Магазин',
  'warehouse': 'Склад', 'industrial': 'Производственное помещение', 'building': 'Здание', 'plot': 'Участок',
  'build-land': 'Земля под строительство', 'agri-land': 'Сельхоз участок', 'abroad-any': 'Недвижимость за рубежом', 'hostel-any': 'Хостел'
}
const HEBREW: Record<string, string> = { required: 'Требуется иврит', none: 'Без иврита' }
const yesNo = (v?: boolean) => (v ? 'Да' : 'Нет')

export interface AdTerm {
  label: string
  value: string
}

export interface AdView {
  /** Ключевые параметры чипами */
  chips: string[]
  /** Блок условий (строки «название - значение») и его заголовок */
  termsTitle: string
  terms: AdTerm[]
  /** Хлебные крошки: «Недвижимость - Снять - Квартира» */
  crumbs: string[]
}

/** Что показать на странице объявления в зависимости от раздела (assumption для разделов без макета) */
export function adView(ad: Ad): AdView {
  switch (ad.section) {
    case 'realty': {
      const p = ad.params
      const chips = [
        REALTY_TYPES[p.type] ?? p.type,
        p.area ? `${p.area}${nbsp}м²` : '',
        p.floor ? `Этаж ${p.floor}${p.floors ? ` из ${p.floors}` : ''}` : '',
        p.rooms ? `${p.rooms} ${p.rooms === 1 ? 'комната' : p.rooms < 5 ? 'комнаты' : 'комнат'}` : '',
        p.bathrooms ? `Санузлов: ${p.bathrooms}` : '',
        ...p.features,
        ...p.extras
      ].filter(Boolean)
      const r = p.rent
      return {
        chips,
        termsTitle: p.deal === 'rent' ? 'Условия аренды' : 'Условия',
        terms: r
          ? [
              ...(r.moveInDate ? [{ label: 'Дата въезда', value: formatDateRu(r.moveInDate) }] : []),
              { label: 'Долгосрочная аренда', value: yesNo(r.longTerm) },
              { label: 'Можно с животными', value: yesNo(r.pets) },
              { label: 'Arnona включена', value: yesNo(r.arnona) },
              { label: 'Vaad Bait включён', value: yesNo(r.vaadBait) }
            ]
          : [],
        crumbs: ['Недвижимость', p.deal === 'rent' ? 'Снять' : 'Купить', REALTY_TYPES[p.type] ?? p.type]
      }
    }
    case 'work': {
      const p = ad.params
      return {
        chips: [...p.schedule, ...p.employment, p.experience === 'none' ? 'Без опыта' : 'Нужен опыт', ...(HEBREW[p.hebrew] ? [HEBREW[p.hebrew]!] : [])],
        termsTitle: 'Условия работы',
        terms: [
          ...(ad.employer ? [{ label: 'Работодатель', value: ad.employer }] : []),
          ...(p.conditions.length ? [{ label: 'Условия', value: p.conditions.join(', ') }] : []),
          ...(p.ageLimit ? [{ label: 'Возраст', value: `до ${p.ageLimit} лет` }] : [])
        ],
        crumbs: ['Работа']
      }
    }
    case 'goods': {
      const p = ad.params
      return {
        chips: [p.condition === 'new' ? 'Новый' : 'Б/У', ...(p.bargain ? ['Торг возможен'] : [])],
        termsTitle: 'Условия продажи',
        terms: [
          { label: 'Формат передачи', value: p.handover.join(', ') || 'Не указан' },
          { label: 'Торг', value: p.bargain ? 'Возможен' : 'Невозможен' }
        ],
        crumbs: ['Товары']
      }
    }
    default: {
      const p = ad.params
      return {
        chips: [...p.formats, ...(p.roundTheClock ? ['Круглосуточно'] : [])],
        termsTitle: 'Условия услуги',
        terms: [
          { label: 'Формат оказания', value: p.formats.join(', ') || 'Не указан' },
          { label: 'Круглосуточно', value: yesNo(p.roundTheClock) }
        ],
        crumbs: ['Услуги']
      }
    }
  }
}

export const sectionTitle = (s: Section) => SECTION_TITLES[s]

/** Ссылки для связи: звонок, Telegram, WhatsApp */
export function contactLinks(contacts: { phone?: string, whatsapp?: string, telegram?: string }) {
  const digits = (s: string) => s.replace(/[^\d]/g, '')
  return [
    contacts.phone ? { kind: 'phone' as const, label: 'Позвонить', href: `tel:${contacts.phone.replace(/[^\d+]/g, '')}` } : null,
    contacts.telegram ? { kind: 'telegram' as const, label: 'Telegram', href: `https://t.me/${contacts.telegram.replace(/^@/, '')}` } : null,
    contacts.whatsapp ? { kind: 'whatsapp' as const, label: 'WhatsApp', href: `https://wa.me/${digits(contacts.whatsapp)}` } : null
  ].filter((x): x is NonNullable<typeof x> => !!x)
}

/** «31.01.2026» для строки «На сервисе с ...» */
export function formatSince(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${d}.${m}.${y}`
}
