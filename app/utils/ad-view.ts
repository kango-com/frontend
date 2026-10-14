import type { Ad, Price, Section } from '~/types'
import { formatDateRu, formatNumber } from './format'
import { tr } from './tr'

const nbsp = ' '

const PERIOD_LONG: Record<NonNullable<Price['period']>, string> = {
  hour: 'в час', week: 'в неделю', month: 'в месяц', day: 'в сутки', shift: 'за смену', total: ''
}

/** Цена для страницы объявления: «5 500 ₪ в месяц», «от 50 ₪» */
export function formatPriceLong(price: Price): string {
  const period = price.period ? tr(PERIOD_LONG[price.period]) : ''
  return `${price.from ? `${tr('от')} ` : ''}${formatNumber(price.amount)}${nbsp}₪${period ? ` ${period}` : ''}`
}

const SECTION_TITLES: Record<Section, string> = { work: 'Работа', realty: 'Недвижимость', goods: 'Товары', services: 'Услуги' }
const REALTY_TYPES: Record<string, string> = {
  'apartment': 'Квартира', 'house': 'Дом', 'studio': 'Студия', 'room': 'Комната', 'office': 'Офис', 'shop': 'Магазин',
  'warehouse': 'Склад', 'industrial': 'Производственное помещение', 'building': 'Здание', 'plot': 'Участок',
  'build-land': 'Земля под строительство', 'agri-land': 'Сельхоз участок', 'abroad-any': 'Недвижимость за рубежом', 'hostel-any': 'Хостел'
}
const HEBREW: Record<string, string> = { required: 'Требуется иврит', none: 'Без иврита' }
const yesNo = (v?: boolean) => (v ? tr('Да') : tr('Нет'))

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
        tr(REALTY_TYPES[p.type] ?? p.type),
        p.area ? `${p.area}${nbsp}${tr('м²')}` : '',
        p.floor ? (p.floors ? tr('Этаж {floor} из {floors}', { floor: p.floor, floors: p.floors }) : tr('Этаж {floor}', { floor: p.floor })) : '',
        p.rooms ? `${p.rooms} ${p.rooms === 1 ? tr('комната') : p.rooms < 5 ? tr('комнаты') : tr('комнат')}` : '',
        p.bathrooms ? tr('Санузлов: {n}', { n: p.bathrooms }) : '',
        ...p.features,
        ...p.extras
      ].filter(Boolean)
      const r = p.rent
      return {
        chips,
        termsTitle: p.deal === 'rent' ? tr('Условия аренды') : tr('Условия'),
        terms: r
          ? [
              ...(r.moveInDate ? [{ label: tr('Дата въезда'), value: formatDateRu(r.moveInDate) }] : []),
              { label: tr('Долгосрочная аренда'), value: yesNo(r.longTerm) },
              { label: tr('Можно с животными'), value: yesNo(r.pets) },
              { label: tr('Arnona включена'), value: yesNo(r.arnona) },
              { label: tr('Vaad Bait включён'), value: yesNo(r.vaadBait) }
            ]
          : [],
        crumbs: [tr('Недвижимость'), p.deal === 'rent' ? tr('Снять') : tr('Купить'), tr(REALTY_TYPES[p.type] ?? p.type)]
      }
    }
    case 'work': {
      const p = ad.params
      return {
        chips: [...p.schedule, ...p.employment, p.experience === 'none' ? tr('Без опыта') : tr('Нужен опыт'), ...(HEBREW[p.hebrew] ? [tr(HEBREW[p.hebrew]!)] : [])],
        termsTitle: tr('Условия работы'),
        terms: [
          ...(ad.employer ? [{ label: tr('Работодатель'), value: ad.employer }] : []),
          ...(p.conditions.length ? [{ label: tr('Условия'), value: p.conditions.join(', ') }] : []),
          ...(p.ageLimit ? [{ label: tr('Возраст'), value: tr('до {n} лет', { n: p.ageLimit }) }] : [])
        ],
        crumbs: [tr('Работа')]
      }
    }
    case 'goods': {
      const p = ad.params
      return {
        chips: [p.condition === 'new' ? tr('Новый') : tr('Б/У'), ...(p.bargain ? [tr('Торг возможен')] : [])],
        termsTitle: tr('Условия продажи'),
        terms: [
          { label: tr('Формат передачи'), value: p.handover.join(', ') || tr('Не указан') },
          { label: tr('Торг'), value: p.bargain ? tr('Возможен') : tr('Невозможен') }
        ],
        crumbs: [tr('Товары')]
      }
    }
    default: {
      const p = ad.params
      return {
        chips: [...p.formats, ...(p.roundTheClock ? [tr('Круглосуточно')] : [])],
        termsTitle: tr('Условия услуги'),
        terms: [
          { label: tr('Формат оказания'), value: p.formats.join(', ') || tr('Не указан') },
          { label: tr('Круглосуточно'), value: yesNo(p.roundTheClock) }
        ],
        crumbs: [tr('Услуги')]
      }
    }
  }
}

export const sectionTitle = (s: Section) => SECTION_TITLES[s]

/** Ссылки для связи: звонок, Telegram, WhatsApp */
export function contactLinks(contacts: { phone?: string, whatsapp?: string, telegram?: string }) {
  const digits = (s: string) => s.replace(/[^\d]/g, '')
  return [
    contacts.phone ? { kind: 'phone' as const, label: tr('Позвонить'), href: `tel:${contacts.phone.replace(/[^\d+]/g, '')}` } : null,
    contacts.telegram ? { kind: 'telegram' as const, label: 'Telegram', href: `https://t.me/${contacts.telegram.replace(/^@/, '')}` } : null,
    contacts.whatsapp ? { kind: 'whatsapp' as const, label: 'WhatsApp', href: `https://wa.me/${digits(contacts.whatsapp)}` } : null
  ].filter((x): x is NonNullable<typeof x> => !!x)
}

/** «31.01.2026» для строки «На сервисе с ...» */
export function formatSince(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${d}.${m}.${y}`
}
