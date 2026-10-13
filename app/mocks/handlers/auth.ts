import { http } from 'msw'
import { save, state } from '../db'
import { demoUser } from '../fixtures/users'
import { currentUser, fail, json, makeId, noContent, simulate } from '../utils'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const publicUser = ({ password: _p, ...user }: typeof demoUser) => user

function startSession(userId: string) {
  const token = makeId('t_') + makeId('')
  state.sessions[token] = userId
  save()
  return token
}

export const authHandlers = (base: string) => [
  http.post(`${base}/auth/login`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const { email, password } = (await request.json()) as { email?: string, password?: string }
    const fields: Record<string, string> = {}
    if (!email) fields.email = 'Заполните поля'
    if (!password) fields.password = 'Заполните поля'
    if (Object.keys(fields).length) return fail(422, 'validation', 'Заполните поля', fields)
    const user = state.users.find(u => u.email.toLowerCase() === email!.toLowerCase())
    if (!user || user.password !== password) return fail(401, 'unauthorized', 'Неверный e-mail или пароль')
    return json({ user: publicUser(user), token: startSession(user.id) })
  }),

  http.post(`${base}/auth/register`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const { name, email, password } = (await request.json()) as { name?: string, email?: string, password?: string }
    const fields: Record<string, string> = {}
    if (!name?.trim()) fields.name = 'Заполните поля'
    if (!email || !EMAIL.test(email)) fields.email = 'Введите корректный e-mail'
    if (!password || password.length < 8) fields.password = 'Короткий пароль'
    if (Object.keys(fields).length) return fail(422, 'validation', 'Проверьте поля формы', fields)
    if (state.users.some(u => u.email.toLowerCase() === email!.toLowerCase())) {
      return fail(409, 'conflict', 'Этот e-mail уже зарегистрирован', { email: 'Этот e-mail уже зарегистрирован' })
    }
    const user = { id: makeId('u-'), name: name!.trim(), email: email!, password: password!, createdAt: new Date().toISOString() }
    state.users.push(user)
    return json({ user: publicUser(user), token: startSession(user.id) }, 201)
  }),

  http.post(`${base}/auth/social`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const { provider } = (await request.json()) as { provider: string }
    const email = `${provider}.user@kango.com`
    let user = state.users.find(u => u.email === email)
    if (!user) {
      user = { id: makeId('u-'), name: provider === 'google' ? 'Пользователь Google' : 'Пользователь Facebook', email, password: makeId('x'), createdAt: new Date().toISOString() }
      state.users.push(user)
    }
    return json({ user: publicUser(user), token: startSession(user.id) })
  }),

  http.post(`${base}/auth/logout`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const header = request.headers.get('authorization')
    if (header?.startsWith('Bearer ')) { delete state.sessions[header.slice(7)]; save() }
    return noContent()
  }),

  http.get(`${base}/auth/me`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const user = currentUser(request)
    return user ? json(publicUser(user)) : fail(401, 'unauthorized', 'Нужно войти в аккаунт')
  }),

  http.post(`${base}/auth/forgot`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const { email } = (await request.json()) as { email?: string }
    if (!email || !EMAIL.test(email)) return fail(422, 'validation', 'Введите корректный e-mail', { email: 'Введите корректный e-mail' })
    const token = makeId('r_') + makeId('')
    state.resetTokens[token] = { email, expiresAt: Date.now() + 30 * 60_000 }
    save()
    // Письмо в моке не отправляется: ссылка возвращается в ответе и пишется в консоль
    const devLink = `/reset?token=${token}`
    console.info('[mock] ссылка для сброса пароля:', devLink)
    return json({ sent: true as const, devLink })
  }),

  http.get(`${base}/auth/reset/validate`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const token = new URL(request.url).searchParams.get('token') ?? ''
    const entry = state.resetTokens[token]
    return json({ valid: !!entry && entry.expiresAt > Date.now() })
  }),

  http.post(`${base}/auth/reset`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const { token, password } = (await request.json()) as { token?: string, password?: string }
    const entry = token ? state.resetTokens[token] : undefined
    if (!entry || entry.expiresAt <= Date.now()) return fail(410, 'expired', 'Ссылка устарела')
    if (!password || password.length < 8) return fail(422, 'validation', 'Короткий пароль', { password: 'Короткий пароль' })
    const user = state.users.find(u => u.email.toLowerCase() === entry.email.toLowerCase())
    if (user) user.password = password
    delete state.resetTokens[token!]
    save()
    return json({ ok: true as const })
  })
]
