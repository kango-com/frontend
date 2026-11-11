import { copyFileSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'

// https://nuxt.com/docs/api/configuration/nuxt-config
// Пока нет бэкенда, API отвечает мок (MSW в браузере). В этом режиме приложение собирается как SPA.
const useMock = process.env.NUXT_PUBLIC_USE_MOCK !== 'false'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  hooks: {
    // Карта (docs/map.md): воркер MapLibre импортирует соседний maplibre-gl-shared.mjs, через ?url Vite выкладывает только воркер
    // (404 -> «Worker failed to load», карта серая). Кладём оба файла и RTL-плагин (подписи на иврите и арабском) в public/maplibre/.
    'build:before': () => {
      const req = createRequire(import.meta.url)
      const out = new URL('./public/maplibre/', import.meta.url)
      mkdirSync(out, { recursive: true })
      const dist = req.resolve('maplibre-gl/package.json').replace(/package\.json$/, 'dist/')
      for (const f of ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs']) copyFileSync(dist + f, new URL(f, out))
      // у пакета exports не открывает dist/, поэтому путь напрямую
      copyFileSync(new URL('./node_modules/@mapbox/mapbox-gl-rtl-text/dist/mapbox-gl-rtl-text.js', import.meta.url), new URL('mapbox-gl-rtl-text.js', out))
    }
  },
  ssr: !useMock,
  runtimeConfig: {
    public: {
      apiBase: '/api',
      useMock,
      // Карта: файл PMTiles (scripts/fetch-map.sh) и шрифты подписей; в продакшене - адреса в S3/CDN с поддержкой Range
      // (NUXT_PUBLIC_MAP_TILES_URL, NUXT_PUBLIC_MAP_GLYPHS_URL)
      mapTilesUrl: '/maps/israel.pmtiles',
      mapGlyphsUrl: '/maps/fonts/{fontstack}/{range}.pbf',
      // Запасная подложка, если своего файла тайлов нет: OpenFreeMap (бесплатно, без ключа). Пустая строка - отключить (NUXT_PUBLIC_MAP_FALLBACK_STYLE_URL)
      mapFallbackStyleUrl: 'https://tiles.openfreemap.org/styles/positron'
    }
  },
  modules: ['@nuxt/icon', '@nuxt/fonts', '@pinia/nuxt', '@nuxtjs/i18n'],
  // Язык хранится в cookie (без префиксов в адресе), иврит отображается справа налево
  i18n: {
    defaultLocale: 'ru',
    strategy: 'no_prefix',
    locales: [
      { code: 'ru', language: 'ru-RU', name: 'Русский', dir: 'ltr', file: 'ru.json' },
      { code: 'en', language: 'en-US', name: 'English', dir: 'ltr', file: 'en.json' },
      { code: 'he', language: 'he-IL', name: 'עברית', dir: 'rtl', file: 'he.json' }
    ],
    // язык браузера не определяем (пока переведена только часть интерфейса), выбор хранит плагин 03.lang.ts
    detectBrowserLanguage: false
  },
  css: ['maplibre-gl/dist/maplibre-gl.css', '~/assets/css/tokens.css', '~/assets/css/base.css'],
  components: [{ path: '~/components', pathPrefix: false }],
  fonts: {
    families: [
      { name: 'Onest', weights: [400, 500, 600, 700], styles: ['normal'], subsets: ['latin', 'cyrillic'] },
      { name: 'Heebo', weights: [400, 500, 600, 700], styles: ['normal'], subsets: ['hebrew', 'latin'] }
    ]
  },
  icon: {
    customCollections: [{ prefix: 'kango', dir: './app/assets/icons' }]
  },
  devtools: { enabled: true },
  // На Windows dev-сервер иногда слушает только IPv6 (::1), и браузер по localhost не подключается
  devServer: { host: '127.0.0.1' },
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
