import { http } from 'msw'
import { nameVariants } from '../names'
import type { SectionInfo } from '~/types'
import { publicAds } from '../db'
import { cities, districts, pointInCity, streetsOf } from '../fixtures/geo'
import { filterAds } from '../filtering'
import { fail, json, list, simulate } from '../utils'

const SECTION_TITLES: Record<string, string> = { work: 'Работа', realty: 'Недвижимость', goods: 'Товары', services: 'Услуги' }

export const geoHandlers = (base: string) => [
  http.get(`${base}/cities`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const url = new URL(request.url)
    const q = (url.searchParams.get('q') ?? '').trim().toLowerCase()
    const limit = Number(url.searchParams.get('limit') ?? 50)
    // как в макете: совпадение с начала названия или любой его части («Ав» находит «Тель-Авив»)
    const found = cities.filter(c => nameVariants(c.name).some(n => n.startsWith(q) || n.split(/[\s-]+/).some(w => w.startsWith(q))))
    // совпадения с начала названия выше
    found.sort((a, b) => Number(nameVariants(b.name).some(n => n.startsWith(q))) - Number(nameVariants(a.name).some(n => n.startsWith(q))) || a.name.localeCompare(b.name, 'ru'))
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

  // Мок геокодера: устойчивая точка в городе по тексту адреса (настоящий - Nominatim или свой сервис). exact=false - найден только город
  http.get(`${base}/geo/geocode`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const url = new URL(request.url)
    const name = (url.searchParams.get('city') ?? '').trim()
    const address = (url.searchParams.get('address') ?? '').trim().toLowerCase()
    const city = cities.find(c => c.name === name || c.id === name)
    if (!city?.coordinates) return fail(404, 'not_found', 'Адрес не найден')
    if (!address) return json({ point: city.coordinates, exact: false })
    const h = [...address].reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) >>> 0, 7)
    return json({ point: pointInCity(city.id, h % 7, (h % 1000) / 1000, ((h >> 10) % 1000) / 1000)!, exact: true })
  }),

  http.get(`${base}/sections`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const cityIds = list(new URL(request.url), 'city')
    const ads = publicAds()
    const sections: SectionInfo[] = (['work', 'realty', 'goods', 'services'] as const).map(id => ({
      id,
      title: SECTION_TITLES[id]!,
      count: filterAds(ads, { section: id, cityIds }).length
    }))
    return json(sections)
  })
]
