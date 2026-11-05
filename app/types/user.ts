export type Lang = 'ru' | 'en' | 'he'

/** Уведомления: каналы и типы событий */
export interface NotificationSettings {
  email: boolean
  push: boolean
  messages: boolean
  moderation: boolean
  support: boolean
  promo: boolean
}

export interface User {
  id: string
  name: string
  email: string
  /** ISO-дата регистрации */
  createdAt: string
  avatarUrl?: string
  /** Контакты по умолчанию для новых объявлений */
  phone?: string
  /** WhatsApp на том же номере */
  whatsapp?: boolean
  telegram?: string
  language?: Lang
  notifications?: NotificationSettings
}

export interface AuthResult {
  user: User
  token: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export type SocialProvider = 'google' | 'facebook'

export type ProfilePatch = Partial<Pick<User, 'name' | 'email' | 'avatarUrl' | 'phone' | 'whatsapp' | 'telegram' | 'language' | 'notifications'>>

export interface ChangePasswordPayload {
  current: string
  next: string
}
