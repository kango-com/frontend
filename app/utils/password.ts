export type PasswordStrength = 'empty' | 'short' | 'weak' | 'strong'

/** Оценка надёжности: короче 8 символов - «Короткий пароль», дальше по разнообразию символов */
export function passwordStrength(password: string): PasswordStrength {
  if (!password) return 'empty'
  if (password.length < 8) return 'short'
  const kinds = [/[a-zа-я]/, /[A-ZА-Я]/, /\d/, /[^\w\sа-яА-Я]/].filter(r => r.test(password)).length
  return kinds >= 3 || (password.length >= 12 && kinds >= 2) ? 'strong' : 'weak'
}

export const STRENGTH_LABELS: Record<PasswordStrength, string> = {
  empty: '',
  short: 'Короткий пароль',
  weak: 'Простой пароль',
  strong: 'Надежный'
}

/** Адрес возврата после входа: только внутренний путь, иначе профиль */
export function safeRedirect(value: unknown, fallback = '/profile'): string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : fallback
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const isEmail = (value: string) => EMAIL.test(value.trim())
