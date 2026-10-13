import { http } from 'msw'
import type { FilterState } from '~/types'
import { allAds } from '../db'
import { byParent, goodsBrands, goodsCategories, goodsModels, goodsSubcategories, realtyCategories, realtyDevelopers, realtyProjects, realtySubtypes, realtyTypes, servicesCategories, servicesSubcategories, workCategories, workPositions } from '../fixtures/references'
import { filterAds } from '../filtering'
import { json, list, simulate } from '../utils'

const ref = (base: string, path: string, items: (url: URL) => unknown) =>
  http.get(`${base}/references/${path}`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    return json(items(new URL(request.url)))
  })

export const filtersHandlers = (base: string) => [
  http.get(`${base}/filters/count`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const url = new URL(request.url)
    let filter: Partial<FilterState> | undefined
    try { filter = JSON.parse(url.searchParams.get('f') ?? 'null') ?? undefined } catch { /* ignore */ }
    const count = filterAds(allAds(), {
      section: url.searchParams.get('section') ?? undefined,
      q: url.searchParams.get('q') ?? undefined,
      cityIds: filter?.cityIds ?? [],
      filter
    }).length
    return json({ count })
  }),

  ref(base, 'work/categories', () => workCategories),
  ref(base, 'work/positions', u => byParent(workPositions, u.searchParams.get('categoryId') ?? undefined)),
  ref(base, 'realty/categories', () => realtyCategories),
  ref(base, 'realty/types', u => byParent(realtyTypes, u.searchParams.get('category') ?? undefined)),
  ref(base, 'realty/subtypes', u => byParent(realtySubtypes, u.searchParams.get('type') ?? undefined)),
  ref(base, 'realty/projects', (u) => { const ids = list(u, 'cityIds'); return ids.length ? realtyProjects.filter(p => ids.includes(p.parentId ?? '')) : realtyProjects }),
  ref(base, 'realty/developers', (u) => { const ids = list(u, 'projectIds'); return ids.length ? realtyDevelopers.filter(d => ids.includes(d.parentId ?? '')) : realtyDevelopers }),
  ref(base, 'goods/categories', () => goodsCategories),
  ref(base, 'goods/subcategories', u => byParent(goodsSubcategories, u.searchParams.get('categoryId') ?? undefined)),
  ref(base, 'goods/brands', (u) => {
    const sub = u.searchParams.get('subcategoryId')
    const cat = u.searchParams.get('categoryId')
    if (sub) return goodsBrands.filter(b => b.parentId === sub)
    if (cat) { const subs = goodsSubcategories.filter(s => s.parentId === cat).map(s => s.id); return goodsBrands.filter(b => subs.includes(b.parentId ?? '')) }
    return goodsBrands
  }),
  ref(base, 'goods/models', (u) => { const ids = list(u, 'brandIds'); return ids.length ? goodsModels.filter(m => ids.includes(m.parentId ?? '')) : goodsModels }),
  ref(base, 'services/categories', () => servicesCategories),
  ref(base, 'services/subcategories', u => byParent(servicesSubcategories, u.searchParams.get('categoryId') ?? undefined))
]
