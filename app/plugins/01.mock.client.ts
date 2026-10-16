// Подключает мок API (MSW) до запуска приложения. Работает только при NUXT_PUBLIC_USE_MOCK=true.
// Без активного Service Worker запросы к /api уходят на dev-сервер и получают HTML, поэтому старт делаем надёжным:
// повторяем регистрацию, а если страница не под контролем воркера (жёсткая перезагрузка), один раз перезагружаем её.
export default defineNuxtPlugin({
  name: 'mock-api',
  enforce: 'pre',
  async setup() {
    const config = useRuntimeConfig()
    if (!config.public.useMock) return
    const { startMock } = await import('~/mocks/browser')

    // Обновление Service Worker иногда не удаётся (dev-сервер занят пересборкой): мок при этом продолжает работать,
    // поэтому такая ошибка не должна всплывать оверлеем как сбой приложения
    window.addEventListener('unhandledrejection', (e) => {
      if (/ServiceWorker/i.test(String((e.reason as Error | undefined)?.message ?? e.reason))) {
        e.preventDefault()
        console.warn('[mock]', (e.reason as Error | undefined)?.message ?? e.reason)
      }
    })

    let started = false
    for (let attempt = 0; attempt < 3 && !started; attempt++) {
      try {
        await startMock(config.public.apiBase as string)
        started = true
      } catch (e) {
        console.error('[mock] не удалось запустить Service Worker, повтор', e)
        await new Promise(resolve => setTimeout(resolve, 300 * (attempt + 1)))
      }
    }

    if (started && 'serviceWorker' in navigator && !navigator.serviceWorker.controller) {
      const FLAG = 'kango.mock.reloaded'
      try {
        if (!sessionStorage.getItem(FLAG)) {
          sessionStorage.setItem(FLAG, '1')
          location.reload()
          return
        }
      } catch { /* sessionStorage недоступен: продолжаем без перезагрузки */ }
    }
    try { sessionStorage.removeItem('kango.mock.reloaded') } catch { /* ignore */ }
  }
})
