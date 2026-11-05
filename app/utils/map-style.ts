import { layers, namedFlavor } from '@protomaps/basemaps'
import type { LayerSpecification, StyleSpecification } from 'maplibre-gl'

/**
 * Стиль карты (MapLibre) на базе @protomaps/basemaps - единственное место, где задаётся внешний вид карты (docs/map.md).
 * Подписи на языке интерфейса: ru / en / he (для иврита нужен RTL-плагин, его подключает useMapLibre).
 */
export interface MapUrls {
  /** Абсолютный адрес файла PMTiles */
  tiles: string
  /** Шаблон адреса шрифтов с {fontstack} и {range}, абсолютный */
  glyphs: string
}

/** Цвета подложки: спокойная вода и земля, чтобы оранжевые метки цен читались */
const KANGO_FLAVOR = { water: '#cfe3ea', earth: '#f6f5f1', buildings: '#e7e4dc', park_a: '#e3efd9', park_b: '#dcebd0' }

export function buildMapStyle(lang: string, urls: MapUrls, withTiles = true): StyleSpecification {
  const flavor = { ...namedFlavor('light'), ...KANGO_FLAVOR }
  if (!withTiles) {
    // файла тайлов нет (не выгружен scripts/fetch-map.sh): только фон, метки поверх него всё равно работают
    return { version: 8, glyphs: urls.glyphs, sources: {}, layers: [{ id: 'background', type: 'background', paint: { 'background-color': flavor.earth } }] }
  }
  return {
    version: 8,
    glyphs: urls.glyphs,
    sources: {
      protomaps: {
        type: 'vector',
        url: `pmtiles://${urls.tiles}`,
        attribution:
          '<a href="https://protomaps.com" target="_blank" rel="noopener">Protomaps</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>'
      }
    },
    // без спрайта (значков) слои с иконками - щиты номеров дорог - не рисуем, иначе предупреждения о ненайденных картинках
    layers: (layers('protomaps', flavor, { lang }) as LayerSpecification[]).filter(
      l => !(l.type === 'symbol' && l.layout && 'icon-image' in l.layout)
    )
  }
}

/** Абсолютные адреса плиток и шрифтов из настроек (относительные считаются от текущего origin) */
export function resolveMapUrls(tiles: string, glyphs: string, origin: string): MapUrls {
  return {
    tiles: new URL(tiles, origin).toString(),
    glyphs: new URL(glyphs, origin).toString().replace(/%7B/g, '{').replace(/%7D/g, '}')
  }
}

/** Израиль целиком: стартовый вид и границы прокрутки карты */
export const ISRAEL_VIEW = { center: [34.95, 31.6] as [number, number], zoom: 6.6 }
export const ISRAEL_MAX_BOUNDS: [[number, number], [number, number]] = [[33.6, 28.9], [36.6, 33.8]]

/**
 * Запасная подложка без своего файла тайлов - стиль OpenFreeMap (бесплатно, без ключа, данные OpenStreetMap, схема OpenMapTiles).
 * Подписи переводятся на язык интерфейса: name:ru / name:en / name:he, иначе местное название.
 */
export function localizeFallbackStyle(style: StyleSpecification, lang: string): StyleSpecification {
  const label: unknown = ['coalesce', ['get', `name:${lang}`], ['get', 'name']]
  return {
    ...style,
    layers: style.layers.map((l) => {
      if (l.type !== 'symbol' || !l.layout?.['text-field']) return l
      // номера дорог («ref») оставляем как есть, меняем только названия
      if (!JSON.stringify(l.layout['text-field']).includes('name')) return l
      return { ...l, layout: { ...l.layout, 'text-field': label as never } }
    })
  }
}
