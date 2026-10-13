import { describe, expect, it } from 'vitest'
import { activeFilterCount, changedFields, defaultFilter, filterFromQuery, filterToQuery, sortButtonLabel, sortsFor } from '../app/utils/filters'

describe('фильтры', () => {
  it('по умолчанию ничего не изменено', () => {
    for (const s of ['work', 'realty', 'goods', 'services'] as const) {
      expect(activeFilterCount(defaultFilter(s))).toBe(0)
      expect(filterToQuery(defaultFilter(s))).toEqual({})
    }
  })

  it('считает только изменённые поля, сортировка не в счёт', () => {
    const f = { ...defaultFilter('work'), categoryId: 'hospitality', positionIds: ['hospitality-p7'], sort: 'date' as const }
    expect(changedFields(f).sort()).toEqual(['categoryId', 'positionIds'])
    expect(activeFilterCount(f)).toBe(2)
  })

  it('туда и обратно через параметры URL', () => {
    const f = { ...defaultFilter('work'), cityIds: ['haifa', 'arad'], categoryId: 'it', hebrew: 'none' as const, priceFrom: 1000, ageLimit: 45, sort: 'salary-desc' as const }
    const q = filterToQuery(f)
    expect(q).toMatchObject({ cityIds: 'haifa,arad', categoryId: 'it', hebrew: 'none', priceFrom: '1000', ageLimit: '45', sort: 'salary-desc' })
    expect(filterFromQuery('work', q)).toEqual(f)
  })

  it('булевы и массивы раздела «Услуги»', () => {
    const f = { ...defaultFilter('services'), formats: ['home', 'online'], roundTheClock: true }
    const back = filterFromQuery('services', filterToQuery(f))
    expect(back).toEqual(f)
  })

  it('неизвестные параметры URL игнорируются', () => {
    expect(filterFromQuery('goods', { foo: 'bar', condition: 'new' })).toEqual({ ...defaultFilter('goods'), condition: 'new' })
  })

  it('подпись кнопки сортировки', () => {
    expect(sortButtonLabel('default')).toBe('Сортировка')
    expect(sortButtonLabel('cheaper')).toBe('Дешевле')
    expect(sortsFor('work')).toContain('salary-desc')
    expect(sortsFor('goods')).not.toContain('salary-desc')
  })
})
