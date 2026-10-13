import type { PaymentSession, PaymentStatus, PromoPackage, PromoPackageId } from '~/types'
import { apiFetch } from './client'

export const paymentsApi = {
  packages: () => apiFetch<PromoPackage[]>('/promo-packages'),
  create: (adId: string, packageId: PromoPackageId, returnUrl: string) =>
    apiFetch<PaymentSession>('/payments', { method: 'POST', body: { adId, packageId, returnUrl } }),
  status: (id: string) => apiFetch<PaymentStatus>(`/payments/${id}`),
  /** Только мок: имитация подтверждения оплаты на стороне провайдера */
  confirm: (id: string, result: 'paid' | 'failed' | 'cancelled') =>
    apiFetch<PaymentStatus>(`/payments/${id}/confirm`, { method: 'POST', body: { result } })
}
