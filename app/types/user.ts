export interface User {
  id: string
  name: string
  email: string
  /** ISO-дата регистрации */
  createdAt: string
  avatarUrl?: string
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
