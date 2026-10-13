import { http } from 'msw'
import { findAd, save, state } from '../db'
import { promoPackages } from '../fixtures/content'
import { currentUser, fail, json, makeId, notFound, simulate, unauthorized } from '../utils'

export const paymentsHandlers = (base: string) => [
  http.get(`${base}/promo-packages`, async () => {
    const err = await simulate(); if (err) return err
    return json(promoPackages)
  }),

  http.post(`${base}/payments`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    if (!currentUser(request)) return unauthorized()
    const { adId, packageId, returnUrl } = (await request.json()) as { adId: string, packageId: string, returnUrl?: string }
    if (!findAd(adId)) return notFound('Объявление')
    if (!promoPackages.some(p => p.id === packageId)) return fail(422, 'validation', 'Выберите пакет', { packageId: 'Выберите пакет' })
    const id = makeId('pay_')
    state.payments[id] = { id, adId, packageId, status: 'pending' }
    save()
    const redirectUrl = `/mock/pay?payment=${id}&return=${encodeURIComponent(returnUrl ?? '/new/success')}`
    return json({ id, redirectUrl }, 201)
  }),

  http.get(`${base}/payments/:id`, async ({ params }) => {
    const err = await simulate(); if (err) return err
    const p = state.payments[String(params.id)]
    return p ? json({ id: p.id, status: p.status, adId: p.adId }) : notFound('Платёж')
  }),

  http.post(`${base}/payments/:id/confirm`, async ({ params, request }) => {
    const err = await simulate(); if (err) return err
    const p = state.payments[String(params.id)]
    if (!p) return notFound('Платёж')
    const { result } = (await request.json()) as { result: 'paid' | 'failed' | 'cancelled' }
    p.status = result
    if (result === 'paid') state.promoted[p.adId] = p.packageId
    save()
    return json({ id: p.id, status: p.status, adId: p.adId })
  })
]
