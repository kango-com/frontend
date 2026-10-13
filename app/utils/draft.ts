import type { AdDraft, Section } from '~/types'

export type DraftData = Partial<AdDraft> & { section?: Section }

/** Валидация черновика подачи объявления: имя поля -> сообщение (пусто, если всё в порядке) */
export function validateDraft(d: DraftData): Record<string, string> {
  const e: Record<string, string> = {}
  const required = 'Заполните поле'
  if (!d.section) { e.section = 'Выберите раздел'; return e }
  if (!d.title?.trim()) e.title = 'Назовите объявление'
  if (!d.price || !(d.price.amount > 0)) e.price = 'Укажите стоимость'
  if (!d.city) e.city = required
  if (!d.contacts?.phone && !d.contacts?.whatsapp && !d.contacts?.telegram) e.phone = 'Укажите хотя бы один контакт'
  if ((d.description?.length ?? 0) > 500) e.description = 'Не больше 500 символов'
  const p = (d.params ?? {}) as Record<string, unknown>
  if (d.section === 'work') {
    if (!p.categoryId) e.categoryId = required
    if (!p.positionId) e.positionId = required
  } else if (d.section === 'realty') {
    if (!p.deal) e.deal = required
    if (!p.type) e.type = required
  } else if (d.section === 'goods') {
    if (!p.categoryId) e.categoryId = required
    if (!p.condition) e.condition = required
  } else if (d.section === 'services') {
    if (!p.categoryId) e.categoryId = required
    if (!Array.isArray(p.formats) || !p.formats.length) e.formats = required
  }
  return e
}
