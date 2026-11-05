import { describe, expect, it } from 'vitest'
import { formatAdsCount, formatChatDay, formatChatTime, formatNumber, formatPrice, formatPriceShort, formatPublished } from '../app/utils/format'

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

describe('formatChatTime / formatChatDay', () => {
  const now = new Date(2026, 10, 5, 15, 0)
  it('сегодня - время, вчера - «Вчера», раньше - дата', () => {
    expect(formatChatTime(new Date(2026, 10, 5, 9, 7).toISOString(), now)).toBe('09:07')
    expect(formatChatTime(new Date(2026, 10, 4, 23, 0).toISOString(), now)).toBe('Вчера')
    expect(formatChatTime(new Date(2026, 9, 12, 8, 0).toISOString(), now)).toBe('12 окт')
    expect(formatChatDay(new Date(2026, 10, 5, 1, 0).toISOString(), now)).toBe('Сегодня')
    expect(formatChatDay(new Date(2025, 9, 12, 8, 0).toISOString(), now)).toBe('12 окт 2025')
  })
})

describe('formatPriceShort', () => {
  it('сокращает тысячи и миллионы', () => {
    expect(formatPriceShort(5500)).toBe('5 500 ₪')
    expect(formatPriceShort(245_000)).toBe('245 тыс. ₪')
    expect(formatPriceShort(2_450_000)).toBe('2,45 млн ₪')
  })
})
