import { describe, expect, it } from 'vitest'
import { validateDraft } from '../app/utils/draft'

const base = { title: 'Продам диван', price: { amount: 2200, currency: 'ILS' as const }, city: 'Тель-Авив', contacts: { phone: '+972 50 123 45 67' } }

describe('валидация черновика подачи', () => {
  it('без раздела подача не начата', () => {
    expect(validateDraft({})).toEqual({ section: 'Выберите раздел' })
  })

  it('обязательные общие поля', () => {
    const e = validateDraft({ section: 'goods', params: {} } as never)
    expect(Object.keys(e)).toEqual(expect.arrayContaining(['title', 'price', 'city', 'phone', 'categoryId', 'condition']))
  })

  it('достаточно одного контакта', () => {
    expect(validateDraft({ ...base, section: 'goods', params: { categoryId: 'furniture', condition: 'new' } } as never)).toEqual({})
    expect(validateDraft({ ...base, contacts: { telegram: '@x' }, section: 'goods', params: { categoryId: 'furniture', condition: 'new' } } as never)).toEqual({})
  })

  it('описание не длиннее 500 символов', () => {
    const e = validateDraft({ ...base, section: 'goods', description: 'x'.repeat(501), params: { categoryId: 'a', condition: 'new' } } as never)
    expect(e.description).toBe('Не больше 500 символов')
  })

  it('поля раздела', () => {
    expect(validateDraft({ ...base, section: 'work', params: {} } as never)).toMatchObject({ categoryId: 'Заполните поле', positionId: 'Заполните поле' })
    expect(validateDraft({ ...base, section: 'services', params: { categoryId: 'x', formats: [] } } as never)).toMatchObject({ formats: 'Заполните поле' })
  })
})
