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

/** Операция по платной опции (история в кабинете) */
export interface Purchase {
  id: string
  adId: string
  adTitle: string
  packageId: PromoPackageId
  title: string
  /** Сумма в шекелях */
  amount: number
  status: 'pending' | 'paid' | 'failed' | 'cancelled'
  /** ISO-дата операции */
  createdAt: string
  /** ISO-дата окончания действия опции (для оплаченных) */
  activeUntil?: string
}
