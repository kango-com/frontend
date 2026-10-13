// Подключает мок API (MSW) до запуска приложения. Работает только при NUXT_PUBLIC_USE_MOCK=true.
export default defineNuxtPlugin({
  name: 'mock-api',
  enforce: 'pre',
  async setup() {
    const config = useRuntimeConfig()
    if (!config.public.useMock) return
    const { startMock } = await import('~/mocks/browser')
    await startMock(config.public.apiBase as string)
  }
})
