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
