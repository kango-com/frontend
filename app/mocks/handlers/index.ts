import { http } from 'msw'
import { adsHandlers } from './ads'
import { authHandlers } from './auth'
import { contentHandlers } from './content'
import { filtersHandlers } from './filters'
import { geoHandlers } from './geo'
import { meHandlers } from './me'
import { paymentsHandlers } from './payments'
import { searchHandlers } from './search'
import { fail } from '../utils'

export function createHandlers(base: string) {
  return [
    ...authHandlers(base),
    ...geoHandlers(base),
    ...adsHandlers(base),
    ...searchHandlers(base),
    ...filtersHandlers(base),
    ...meHandlers(base),
    ...paymentsHandlers(base),
    ...contentHandlers(base),
    // страховка: незнакомый запрос к API получает JSON-ответ 404 в формате контракта, а не HTML-страницу dev-сервера
    http.all(`${base}/*`, ({ request }) => {
      console.warn(`[mock] нет обработчика для ${request.method} ${new URL(request.url).pathname}`)
      return fail(404, 'not_found', 'Ресурс не найден')
    })
  ]
}
