import { adsHandlers } from './ads'
import { authHandlers } from './auth'
import { contentHandlers } from './content'
import { filtersHandlers } from './filters'
import { geoHandlers } from './geo'
import { meHandlers } from './me'
import { paymentsHandlers } from './payments'
import { searchHandlers } from './search'

export function createHandlers(base: string) {
  return [
    ...authHandlers(base),
    ...geoHandlers(base),
    ...adsHandlers(base),
    ...searchHandlers(base),
    ...filtersHandlers(base),
    ...meHandlers(base),
    ...paymentsHandlers(base),
    ...contentHandlers(base)
  ]
}
