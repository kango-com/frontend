import { describe, expect, it } from 'vitest'
import { formatAdsCount, formatNumber, formatPrice, formatPublished } from '../app/utils/format'

describe('форматирование', () => {
  it('числа и цены', () => {
    expect(formatNumber(1345)).toBe('1 345')
    expect(formatPrice({ amount: 3800, currency: 'ILS' })).toBe('3 800 ₪')
    expect(formatPrice({ amount: 5500, currency: 'ILS', period: 'month' })).toBe('5 500 ₪/мес.')
    expect(formatPrice({ amount: 45, currency: 'ILS', period: 'hour' })).toBe('45 ₪ / час')
    expect(formatPrice({ amount: 50, currency: 'ILS', from: true })).toBe('от 50 ₪')
  })

  it('склонение объявлений', () => {
    expect(formatAdsCount(1)).toBe('1 объявление')
    expect(formatAdsCount(3)).toBe('3 объявления')
    expect(formatAdsCount(11)).toBe('11 объявлений')
    expect(formatAdsCount(1345)).toBe('1 345 объявлений')
  })

  it('дата публикации', () => {
    const now = new Date(2026, 9, 13, 12, 0)
    expect(formatPublished(new Date(2026, 9, 13, 10, 38).toISOString(), now)).toBe('Сегодня, 10:38')
    expect(formatPublished(new Date(2026, 9, 12, 18, 47).toISOString(), now)).toBe('Вчера, 18:47')
    expect(formatPublished(new Date(2026, 9, 5, 9, 15).toISOString(), now)).toBe('5 окт, 09:15')
  })
})
