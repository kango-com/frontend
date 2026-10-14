import { describe, expect, it } from 'vitest'
import { contactLinks, formatPriceLong, formatSince } from '../app/utils/ad-view'

const plain = (s: string) => s.replace(/\u00a0/g, ' ')

describe('страница объявления', () => {
  it('цена с периодом', () => {
    expect(plain(formatPriceLong({ amount: 5500, currency: 'ILS', period: 'month' }))).toBe('5 500 ₪ в месяц')
    expect(plain(formatPriceLong({ amount: 50, currency: 'ILS', from: true }))).toBe('от 50 ₪')
  })
  it('ссылки связи', () => {
    const links = contactLinks({ phone: '+972 50-123-4567', telegram: '@ivan', whatsapp: '+972501234567' })
    expect(links.map(l => l.href)).toEqual(['tel:+972501234567', 'https://t.me/ivan', 'https://wa.me/972501234567'])
    expect(contactLinks({})).toEqual([])
  })
  it('дата регистрации', () => {
    expect(formatSince('2026-01-31T10:00:00Z')).toBe('31.01.2026')
  })
})
