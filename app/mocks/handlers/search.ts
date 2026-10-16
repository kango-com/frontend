import { http } from 'msw'
import { nameVariants } from '../names'
import { allAds, save, state } from '../db'
import { searchVocabulary } from '../fixtures/content'
import { currentUser, fail, json, makeId, noContent, simulate } from '../utils'

const SECTION_TITLES = { work: 'Работа', realty: 'Недвижимость', goods: 'Товары', services: 'Услуги' } as const
const keyOf = (request: Request) => currentUser(request)?.id ?? 'anon'

export const searchHandlers = (base: string) => [
  http.get(`${base}/search/suggest`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const q = (new URL(request.url).searchParams.get('q') ?? '').trim().toLowerCase()
    if (!q) return json([])
    const fromVocab = searchVocabulary
      .filter(v => nameVariants(v.text).some(n => n.includes(q)))
      .sort((a, b) => Number(nameVariants(b.text).some(n => n.startsWith(q))) - Number(nameVariants(a.text).some(n => n.startsWith(q))))
      .map((v, i) => ({ id: `v${i}`, text: v.text, categoryTitle: v.categoryTitle, section: v.section }))
    const fromAds = allAds()
      .filter(a => a.title.toLowerCase().includes(q))
      .slice(0, 4)
      .map(a => ({ id: `a-${a.id}`, text: a.title, categoryTitle: SECTION_TITLES[a.section], section: a.section }))
    const seen = new Set<string>()
    return json([...fromVocab, ...fromAds].filter(s => !seen.has(s.text) && seen.add(s.text)).slice(0, 8))
  }),

  http.get(`${base}/search/popular`, async () => {
    const err = await simulate(); if (err) return err
    const popular = ['Квартира в Тель-Авиве', 'Аренда квартиры', 'Диван', 'Холодильник', 'Гитара', 'Дом с садом', 'Телефоны']
    return json(popular.flatMap((text, i) => {
      const v = searchVocabulary.find(x => x.text === text)
      return v ? [{ id: `p${i}`, text: v.text, categoryTitle: v.categoryTitle, section: v.section }] : []
    }))
  }),

  http.get(`${base}/search/history`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    if (!currentUser(request)) return json([])
    return json(state.history[keyOf(request)] ?? [])
  }),

  http.post(`${base}/search/history`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const user = currentUser(request)
    const { text, categoryTitle } = (await request.json()) as { text?: string, categoryTitle?: string }
    if (!text?.trim()) return fail(422, 'validation', 'Введите запрос', { text: 'Введите запрос' })
    const item = { id: makeId('h'), text: text.trim(), categoryTitle, createdAt: new Date().toISOString() }
    if (user) {
      const list = (state.history[user.id] ??= []).filter(h => h.text !== item.text)
      state.history[user.id] = [item, ...list].slice(0, 10)
      save()
    }
    return json(item, 201)
  }),

  http.delete(`${base}/search/history/:id`, async ({ request, params }) => {
    const err = await simulate(); if (err) return err
    const user = currentUser(request)
    if (user) { state.history[user.id] = (state.history[user.id] ?? []).filter(h => h.id !== params.id); save() }
    return noContent()
  }),

  http.delete(`${base}/search/history`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const user = currentUser(request)
    if (user) { state.history[user.id] = []; save() }
    return noContent()
  })
]
