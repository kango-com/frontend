import type { AdAuthor, User } from '~/types'

export interface UserRecord extends User {
  password: string
}

export const demoUser: UserRecord = {
  id: 'u-demo',
  name: 'Иван Петров',
  email: 'demo@kango.com',
  password: 'Passw0rd!',
  createdAt: '2026-01-31T09:00:00.000Z'
}

export const authors: (AdAuthor & { phone: string, telegram?: string })[] = [
  { id: 'u-1', name: 'Иванов Иван', online: true, since: '2026-01-31T09:00:00.000Z', phone: '+972 50 123 45 67', telegram: '@ivanov' },
  { id: 'u-2', name: 'Мария Коган', online: false, since: '2025-11-12T10:00:00.000Z', phone: '+972 52 765 43 21', telegram: '@maria_k' },
  { id: 'u-3', name: 'Давид Леви', online: true, since: '2025-09-03T08:30:00.000Z', phone: '+972 54 222 33 44' },
  { id: 'u-4', name: 'Анна Соколова', online: false, since: '2026-02-20T15:10:00.000Z', phone: '+972 58 987 65 43', telegram: '@anna_s' },
  { id: 'u-5', name: 'Илья Шапиро', online: true, since: '2025-07-18T12:00:00.000Z', phone: '+972 50 555 66 77' },
  { id: 'u-6', name: 'Елена Гольдберг', online: false, since: '2026-03-05T11:45:00.000Z', phone: '+972 53 444 55 66', telegram: '@elena_g' }
]
