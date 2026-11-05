import type { Price } from '~/types'
import { tr } from './tr'

const nbsp = ' '

export function formatNumber(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, nbsp)
}

const periodSuffix = (period: NonNullable<Price['period']>): string => ({
  hour: `${nbsp}/${nbsp}${tr('час')}`,
  week: `${nbsp}/${nbsp}${tr('нед.')}`,
  month: tr('/мес.'),
  day: `${nbsp}/${nbsp}${tr('сутки')}`,
  shift: `${nbsp}/${nbsp}${tr('смена')}`,
  total: ''
})[period]

/** «3 800 ₪», «5 500 ₪/мес.», «45 ₪ / час», «от 50 ₪» */
export function formatPrice(price: Price): string {
  const suffix = price.period ? periodSuffix(price.period) : ''
  return `${price.from ? `${tr('от')} ` : ''}${formatNumber(price.amount)}${nbsp}₪${suffix}`
}

const pad = (n: number) => String(n).padStart(2, '0')
const time = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`
const MONTHS = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

/** «Сегодня, 10:38», «Вчера, 18:47», «12 окт, 09:15» */
export function formatPublished(iso: string, now: Date = new Date()): string {
  const d = new Date(iso)
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime()
  const days = Math.round((startOf(now) - startOf(d)) / 86_400_000)
  if (days <= 0) return tr('Сегодня, {time}', { time: time(d) })
  if (days === 1) return tr('Вчера, {time}', { time: time(d) })
  return `${d.getDate()} ${tr(MONTHS[d.getMonth()]!)}, ${time(d)}`
}

/** «1 345 объявлений», «1 объявление», «2 объявления»; для en и he свои формы */
export function formatAdsCount(n: number, locale: 'ru' | 'en' | 'he' = 'ru'): string {
  if (locale === 'en') return `${formatNumber(n)} ${n === 1 ? 'ad' : 'ads'}`
  if (locale === 'he') return `${formatNumber(n)} ${n === 1 ? 'מודעה' : 'מודעות'}`
  const mod10 = n % 10
  const mod100 = n % 100
  const word = mod10 === 1 && mod100 !== 11 ? 'объявление' : mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20) ? 'объявления' : 'объявлений'
  return `${formatNumber(n)} ${word}`
}

/** «2026-10-15» → «15 окт 2026» */
export function formatDateRu(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return y && m && d ? `${d} ${tr(MONTHS[m - 1]!)} ${y}` : iso
}

/** ISO-дата и время → «15 окт» (текущий год) или «15 окт 2025» */
export function formatDay(iso: string, now: Date = new Date()): string {
  const d = new Date(iso)
  const base = `${d.getDate()} ${tr(MONTHS[d.getMonth()]!)}`
  return d.getFullYear() === now.getFullYear() ? base : `${base} ${d.getFullYear()}`
}

const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime()
const daysAgo = (iso: string, now: Date) => Math.round((startOfDay(now) - startOfDay(new Date(iso))) / 86_400_000)

/** Время в списке диалогов: сегодня «10:38», вчера «Вчера», раньше «12 окт» */
export function formatChatTime(iso: string, now: Date = new Date()): string {
  const days = daysAgo(iso, now)
  if (days <= 0) return time(new Date(iso))
  if (days === 1) return tr('Вчера')
  return formatDay(iso, now)
}

/** Разделитель дней в ленте сообщений: «Сегодня», «Вчера», «12 окт» */
export function formatChatDay(iso: string, now: Date = new Date()): string {
  const days = daysAgo(iso, now)
  if (days <= 0) return tr('Сегодня')
  if (days === 1) return tr('Вчера')
  return formatDay(iso, now)
}

/** Время сообщения: «10:38» */
export const formatClock = (iso: string): string => time(new Date(iso))

/** Короткая цена для метки на карте: «5 500 ₪», «245 тыс. ₪», «2,45 млн ₪» */
export function formatPriceShort(amount: number): string {
  if (amount >= 1_000_000) return `${String(+(amount / 1_000_000).toFixed(2)).replace('.', ',')}${nbsp}${tr('млн')}${nbsp}₪`
  if (amount >= 100_000) return `${Math.round(amount / 1000)}${nbsp}${tr('тыс.')}${nbsp}₪`
  return `${formatNumber(amount)}${nbsp}₪`
}
