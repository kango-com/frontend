import { Protocol } from 'pmtiles'
import type { Map as MapLibreMap, MapOptions, StyleSpecification } from 'maplibre-gl'
import { buildMapStyle, ISRAEL_MAX_BOUNDS, localizeFallbackStyle, resolveMapUrls } from '~/utils/map-style'

type MapLibre = typeof import('maplibre-gl')

let loading: Promise<MapLibre> | null = null
let tilesCheck: Promise<boolean> | null = null

const abs = (path: string) => new URL(path, window.location.origin).href

/**
 * MapLibre подгружается только когда карта нужна (тяжёлая библиотека). Один раз на страницу:
 * воркер из public/maplibre (см. nuxt.config.ts, hooks), протокол pmtiles:// для файла тайлов, RTL-плагин для иврита и арабского.
 */
export function loadMapLibre(): Promise<MapLibre> {
  loading ??= (async () => {
    const m = await import('maplibre-gl')
    m.setWorkerUrl(abs('/maplibre/maplibre-gl-worker.mjs'))
    m.addProtocol('pmtiles', new Protocol().tile)
    if (m.getRTLTextPluginStatus() === 'unavailable') {
      // ленивая загрузка: плагин скачивается, только когда на карте встретится текст справа налево
      m.setRTLTextPlugin(abs('/maplibre/mapbox-gl-rtl-text.js'), true).catch(() => { /* без плагина подписи на иврите будут в обратном порядке */ })
    }
    return m
  })()
  return loading
}

/** Есть ли файл тайлов (его выгружают отдельно, scripts/fetch-map.sh). Без него карта показывает только метки на фоне */
function checkTiles(url: string): Promise<boolean> {
  tilesCheck ??= fetch(url, { headers: { Range: 'bytes=0-15' } })
    .then(async (r) => {
      if (!r.ok) return false
      // dev-сервер на отсутствующий файл может отдать HTML-страницу: у PMTiles первые байты - «PMTiles»
      const head = new TextDecoder().decode(await r.arrayBuffer()).slice(0, 7)
      return head === 'PMTiles'
    })
    .catch(() => false)
  return tilesCheck
}

let fallbackStyle: Promise<StyleSpecification | null> | null = null
/** Стиль запасной подложки (OpenFreeMap) загружается один раз на страницу */
function loadFallback(url: string): Promise<StyleSpecification | null> {
  fallbackStyle ??= fetch(url).then(r => (r.ok ? r.json() as Promise<StyleSpecification> : null)).catch(() => null)
  return fallbackStyle
}

/** Откуда подложка: свой файл PMTiles, запасной публичный сервер (OpenFreeMap) или ничего (метки на пустом фоне) */
export type Basemap = 'own' | 'fallback' | 'none'

/** Стиль, общие настройки и служебные действия для всех карт сайта (выдача, карточка, выбор адреса) */
export function useMapLibre() {
  const config = useRuntimeConfig().public
  const { locale } = useI18n()
  const basemap = ref<Basemap | null>(null)
  /** Подложка есть (своя или запасная): иначе показывается пояснение */
  const tilesReady = computed(() => (basemap.value === null ? null : basemap.value !== 'none'))
  const urls = () => resolveMapUrls(config.mapTilesUrl as string, config.mapGlyphsUrl as string, window.location.origin)

  /**
   * Подложка по порядку (docs/map.md): 1) свой файл PMTiles - если выгружен, в продакшене обязателен (Договор, Прил. 1, п. 11.3);
   * 2) OpenFreeMap - работает сразу, без скачивания, для разработки и демонстрации; 3) пустой фон.
   */
  async function style(): Promise<StyleSpecification> {
    if (await checkTiles(urls().tiles)) {
      basemap.value = 'own'
      return buildMapStyle(locale.value, urls(), true)
    }
    const fallbackUrl = config.mapFallbackStyleUrl as string
    const fallback = fallbackUrl ? await loadFallback(fallbackUrl) : null
    if (fallback) {
      basemap.value = 'fallback'
      return localizeFallbackStyle(fallback, locale.value)
    }
    basemap.value = 'none'
    return buildMapStyle(locale.value, urls(), false)
  }

  /** Новая карта: колесо листает страницу, масштаб - Ctrl/⌘ + колесо, на телефоне двигают двумя пальцами (cooperativeGestures) */
  async function create(container: HTMLElement, opts: Partial<MapOptions> = {}): Promise<{ map: MapLibreMap, maplibre: MapLibre }> {
    const maplibre = await loadMapLibre()
    const map = new maplibre.Map({
      container,
      style: await style(),
      attributionControl: { compact: true },
      cooperativeGestures: true,
      locale: {
        'CooperativeGesturesHandler.WindowsHelpText': tr('Ctrl + колесо мыши - изменить масштаб'),
        'CooperativeGesturesHandler.MacHelpText': tr('⌘ + прокрутка - изменить масштаб'),
        'CooperativeGesturesHandler.MobileHelpText': tr('Двигайте карту двумя пальцами'),
        'NavigationControl.ZoomIn': tr('Приблизить'),
        'NavigationControl.ZoomOut': tr('Отдалить')
      },
      maxZoom: 18,
      maxBounds: ISRAEL_MAX_BOUNDS,
      pitchWithRotate: false,
      dragRotate: false,
      ...opts
    })
    map.touchZoomRotate.disableRotation()
    // подпись об источнике по умолчанию раскрыта: сворачиваем, раскрывается кликом по «i»
    const collapse = () => {
      const c = container.querySelector('.maplibregl-ctrl-attrib')
      c?.classList.remove('maplibregl-compact-show')
      c?.removeAttribute('open')
    }
    collapse()
    map.once('load', collapse)
    return { map, maplibre }
  }

  /** Смена языка интерфейса - подписи на карте на новом языке */
  function watchLocale(getMap: () => MapLibreMap | undefined) {
    watch(locale, async () => {
      const map = getMap()
      if (map) map.setStyle(await style(), { diff: false })
    })
  }

  return { create, style, tilesReady, basemap, watchLocale }
}
