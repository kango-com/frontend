// https://nuxt.com/docs/api/configuration/nuxt-config
// Пока нет бэкенда, API отвечает мок (MSW в браузере). В этом режиме приложение собирается как SPA.
const useMock = process.env.NUXT_PUBLIC_USE_MOCK !== 'false'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: !useMock,
  runtimeConfig: {
    public: {
      apiBase: '/api',
      useMock
    }
  },
  modules: ['@nuxt/icon', '@nuxt/fonts', '@pinia/nuxt'],
  pinia: { storesDirs: ['./app/stores/**'] },
  css: ['~/assets/css/tokens.css', '~/assets/css/base.css'],
  components: [{ path: '~/components', pathPrefix: false }],
  fonts: {
    families: [
      { name: 'Inter', weights: [400, 500, 600], styles: ['normal'], subsets: ['latin', 'cyrillic'] },
      { name: 'Inter Tight', weights: [400, 500], styles: ['normal'], subsets: ['latin', 'cyrillic'] }
    ]
  },
  icon: {
    customCollections: [{ prefix: 'kango', dir: './app/assets/icons' }]
  },
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Kango - работа, жильё и мастера в Израиле',
      meta: [
        {
          name: 'description',
          content: 'Kango - доска объявлений для русскоязычных жителей Израиля: находите работу, жильё и мастеров и общайтесь напрямую.'
        }
      ],
      htmlAttrs: { lang: 'ru' },
      link: [
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
        { rel: 'icon', href: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
      ]
    }
  }
})
