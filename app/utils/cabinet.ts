/** Меню личного кабинета (ТЗ п. 7.1). Подписи - русские ключи словаря, переводятся при выводе */
export interface CabinetLink {
  to: string
  label: string
  /** Ключ счётчика, который подставляет страница (непрочитанные, объявления и т.п.) */
  count?: 'ads' | 'favorites' | 'services' | 'messages'
}

export const CABINET_LINKS: CabinetLink[] = [
  { to: '/profile/ads', label: 'Мои объявления', count: 'ads' },
  { to: '/messages', label: 'Сообщения', count: 'messages' },
  { to: '/favorites', label: 'Избранное', count: 'favorites' },
  { to: '/viewed', label: 'История просмотров' },
  { to: '/profile/services', label: 'Платные услуги', count: 'services' },
  { to: '/profile/support', label: 'Поддержка' },
  { to: '/profile/edit', label: 'Мой профиль' },
  { to: '/profile/settings', label: 'Настройки' }
]
