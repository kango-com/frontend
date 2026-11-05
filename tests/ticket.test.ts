import { describe, expect, it } from 'vitest'
import { categoryLabel, isOpenTicket, TICKET_CATEGORIES, TICKET_STATUS } from '../app/utils/ticket'

describe('обращения в поддержку', () => {
  it('у каждого статуса есть подпись и тон', () => {
    for (const s of ['new', 'in_progress', 'waiting', 'resolved', 'closed'] as const) {
      expect(TICKET_STATUS[s].label).toBeTruthy()
      expect(TICKET_STATUS[s].tone).toBeTruthy()
    }
  })

  it('писать можно, пока обращение не решено и не закрыто', () => {
    expect(isOpenTicket('new')).toBe(true)
    expect(isOpenTicket('in_progress')).toBe(true)
    expect(isOpenTicket('waiting')).toBe(true)
    expect(isOpenTicket('resolved')).toBe(false)
    expect(isOpenTicket('closed')).toBe(false)
  })

  it('категории по ТЗ п. 7.3: объявление, аккаунт, оплата, жалоба, другое', () => {
    expect(TICKET_CATEGORIES.map(c => c.value)).toEqual(['ad', 'account', 'payment', 'complaint', 'other'])
    expect(categoryLabel('payment')).toBe('Оплата')
  })
})
