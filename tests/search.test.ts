import { describe, expect, it } from 'vitest'
import { highlightParts } from '../app/utils/search'

describe('highlightParts', () => {
  it('выделяет префикс без учёта регистра', () => {
    expect(highlightParts('Телевизоры', 'те')).toEqual([
      { text: 'Те', match: true },
      { text: 'левизоры', match: false }
    ])
  })
  it('выделяет вхождение в середине', () => {
    expect(highlightParts('Телевизор б/у', 'визор')).toEqual([
      { text: 'Теле', match: false },
      { text: 'визор', match: true },
      { text: ' б/у', match: false }
    ])
  })
  it('без запроса или совпадения возвращает целый текст', () => {
    expect(highlightParts('Теплица', '')).toEqual([{ text: 'Теплица', match: false }])
    expect(highlightParts('Теплица', 'гитара')).toEqual([{ text: 'Теплица', match: false }])
  })
})
