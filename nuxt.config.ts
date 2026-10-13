// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
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
