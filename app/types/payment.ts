export type PromoPackageId = 'raise' | 'highlight' | 'max'

export interface PromoPackage {
  id: PromoPackageId
  title: string
  price: number
  description: string
  days: number
}

export interface PaymentSession {
  id: string
  /** Куда отправить пользователя оплачивать */
  redirectUrl: string
}

export interface PaymentStatus {
  id: string
  status: 'pending' | 'paid' | 'failed' | 'cancelled'
  adId: string
}
