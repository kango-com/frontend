import { setupWorker } from 'msw/browser'
import { createHandlers } from './handlers'

/** Запускает мок API в браузере. Вызывается клиентским плагином до монтирования приложения. */
export async function startMock(apiBase: string) {
  const worker = setupWorker(...createHandlers(apiBase))
  await worker.start({ onUnhandledFrame: 'bypass', quiet: true })
  return worker
}
