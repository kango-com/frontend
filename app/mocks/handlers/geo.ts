import { http } from 'msw'
import type { SectionInfo } from '~/types'
import { allAds } from '../db'
import { cities, districts, streetsOf } from '../fixtures/geo'
import { filterAds } from '../filtering'
import { json, list, simulate } from '../utils'

const SECTION_TITLES: Record<string, string> = { work: 'Работа', realty: 'Недвижимость', goods: 'Товары', services: 'Услуги' }

export const geoHandlers = (base: string) => [
  http.get(`${base}/cities`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const url = new URL(request.url)
    const q = (url.searchParams.get('q') ?? '').trim().toLowerCase()
    const limit = Number(url.searchParams.get('limit') ?? 50)
    const found = cities.filter(c => c.name.toLowerCase().includes(q))
    // совпадения с начала названия выше
    found.sort((a, b) => Number(b.name.toLowerCase().startsWith(q)) - Number(a.name.toLowerCase().startsWith(q)) || a.name.localeCompare(b.name, 'ru'))
    return json(found.slice(0, limit))
  }),

  http.get(`${base}/cities/popular`, async () => {
    const err = await simulate(); if (err) return err
    return json(cities.filter(c => c.popular))
  }),

  http.get(`${base}/districts`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const ids = list(new URL(request.url), 'cityIds')
    return json(ids.length ? districts.filter(d => ids.includes(d.cityId)) : districts)
  }),

  http.get(`${base}/streets`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const url = new URL(request.url)
    const cityIds = list(url, 'cityIds')
    const districtIds = list(url, 'districtIds')
    const q = (url.searchParams.get('q') ?? '').toLowerCase()
    const result = cityIds.flatMap(id => streetsOf(id, districtIds.filter(d => d.startsWith(id))))
    return json(result.filter(s => s.title.toLowerCase().includes(q)))
  }),

  http.get(`${base}/sections`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const cityIds = list(new URL(request.url), 'city')
    const ads = allAds()
    const sections: SectionInfo[] = (['work', 'realty', 'goods', 'services'] as const).map(id => ({
      id,
      title: SECTION_TITLES[id]!,
      count: filterAds(ads, { section: id, cityIds }).length
    }))
    return json(sections)
  })
]
