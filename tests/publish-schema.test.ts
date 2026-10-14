import { describe, expect, it } from 'vitest'
import { PUBLISH_BLOCKS, getPath, setPath } from '../app/utils/publish-schema'

describe('форма подачи', () => {
  it('путь с точками читается и пишется без мутации', () => {
    const base = { a: 1, rent: { pets: true } }
    const next = setPath(base, 'rent.longTerm', true)
    expect(next).toEqual({ a: 1, rent: { pets: true, longTerm: true } })
    expect(base).toEqual({ a: 1, rent: { pets: true } })
    expect(getPath(next, 'rent.longTerm')).toBe(true)
    expect(getPath(next, 'rent.missing.x')).toBeUndefined()
  })
  it('условия аренды видны только при аренде', () => {
    const rent = PUBLISH_BLOCKS.realty.flatMap(b => b.fields).find(f => f.key === 'rent.pets')!
    expect(rent.visible?.({ deal: 'rent' })).toBe(true)
    expect(rent.visible?.({ deal: 'sale' })).toBe(false)
  })
  it('подтип только для квартиры и дома', () => {
    const f = PUBLISH_BLOCKS.realty.flatMap(b => b.fields).find(x => x.key === 'subtype')!
    expect(f.visible?.({ type: 'apartment' })).toBe(true)
    expect(f.visible?.({ type: 'office' })).toBe(false)
  })
})
