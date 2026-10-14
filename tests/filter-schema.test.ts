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
