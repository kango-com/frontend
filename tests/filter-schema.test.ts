import { describe, expect, it } from 'vitest'
import { applyLabel } from '../app/utils/filter-schema'
import { defaultValue } from '../app/utils/filters'
import { formatAdsCount } from '../app/utils/format'

describe('кнопка применения фильтров', () => {
  it('подпись по счётчику', () => {
    expect(applyLabel(null, formatAdsCount)).toBe('Показать объявления')
    expect(applyLabel(954, formatAdsCount)).toBe('Показать 954 объявления')
    expect(applyLabel(1, formatAdsCount)).toBe('Показать 1 объявление')
    expect(applyLabel(1000, formatAdsCount)).toBe('Показать более 1 тыс. объявлений')
  })
  it('значение по умолчанию поля раздела', () => {
    expect(defaultValue('work', 'positionIds')).toEqual([])
    expect(defaultValue('work', 'hebrew')).toBe('any')
    expect(defaultValue('work', 'categoryId')).toBeUndefined()
  })
})

describe('скрытые поля фильтра', () => {
  it('при переходе на продажу параметры аренды сбрасываются', async () => {
    const { hiddenDefaults } = await import('../app/utils/filter-schema')
    const { defaultFilter } = await import('../app/utils/filters')
    const f = { ...defaultFilter('realty'), deal: 'sale' as const, rent: ['daily'], moveInBefore: '2026-11-01' }
    expect(hiddenDefaults('realty', f)).toEqual({ rent: [], moveInBefore: undefined })
  })
  it('цена общая для аренды и продажи, не сбрасывается', async () => {
    const { hiddenDefaults } = await import('../app/utils/filter-schema')
    const { defaultFilter } = await import('../app/utils/filters')
    const f = { ...defaultFilter('realty'), deal: 'sale' as const, priceFrom: 1000 }
    expect(hiddenDefaults('realty', f)).not.toHaveProperty('priceFrom')
  })
  it('район услуг виден только при формате «По адресу исполнителя»', async () => {
    const { hiddenDefaults } = await import('../app/utils/filter-schema')
    const { defaultFilter } = await import('../app/utils/filters')
    const f = { ...defaultFilter('services'), districtIds: ['tlv-center'], formats: ['Онлайн'] }
    expect(hiddenDefaults('services', f)).toEqual({ districtIds: [] })
    expect(hiddenDefaults('services', { ...f, formats: ['По адресу исполнителя'] })).toEqual({})
  })
})
