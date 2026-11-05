<script setup lang="ts">
import type { GeoJSONSource, Map as MapLibreMap, Marker } from 'maplibre-gl'
import type { Coordinates, MapAd } from '~/types'
import { formatPriceShort } from '~/utils/format'
import { type Bounds, simplifyPath } from '~/utils/geo'
import { ISRAEL_VIEW } from '~/utils/map-style'

/**
 * Карта объявлений (Договор, Прил. 1, п. 9 «Карта в выдаче»): метки с ценой, кластеры, выбор метки, рисование границы поиска.
 * Подход - как в проекте «Местами вкусно» (docs/map.md): MapLibre GL, свои тайлы PMTiles, метки - HTML-элементы,
 * синхронизированные с кластеризованным GeoJSON-источником (так метки остаются кнопками и доступны с клавиатуры).
 */
const props = withDefaults(defineProps<{
  points: MapAd[]
  selectedId?: string | null
  /** Нарисованная граница поиска */
  area?: Coordinates[] | null
  /** При смене ключа карта подстраивает масштаб под точки (новый поиск, другой город) */
  fitKey?: string
  /** Показывать инструмент «Обвести область» */
  drawable?: boolean
  loading?: boolean
  /** Открыть карту на этой точке вместо охвата всех меток (переход «Открыть на карте» из объявления) */
  focus?: Coordinates | null
}>(), { selectedId: null, area: null, fitKey: '', drawable: true, loading: false, focus: null })

const emit = defineEmits<{
  'select': [id: string | null]
  'bounds': [bounds: Bounds]
  'update:area': [area: Coordinates[] | null]
}>()

const { create, tilesReady, watchLocale } = useMapLibre()
const root = ref<HTMLElement>()
const mapEl = ref<HTMLElement>()
const ready = ref(false)
const failed = ref(false)
let map: MapLibreMap | undefined
let maplibre: typeof import('maplibre-gl') | undefined

const SOURCE = 'ads'
const live = new Map<string, Marker>()

const collection = () => ({
  type: 'FeatureCollection' as const,
  features: props.points.map(p => ({
    type: 'Feature' as const,
    geometry: { type: 'Point' as const, coordinates: [p.coordinates.lng, p.coordinates.lat] },
    properties: { id: p.id, price: p.price.amount, approx: !!p.approximate, title: p.title }
  }))
})

function fit() {
  if (!map || !maplibre) return
  if (props.focus) { map.jumpTo({ center: [props.focus.lng, props.focus.lat], zoom: 15.5 }); return }
  const pts = props.area?.length ? props.area : props.points.map(p => p.coordinates)
  if (!pts.length) { map.easeTo({ center: ISRAEL_VIEW.center, zoom: ISRAEL_VIEW.zoom, duration: 0 }); return }
  const b = new maplibre.LngLatBounds()
  for (const p of pts) b.extend([p.lng, p.lat])
  map.fitBounds(b, { padding: 48, maxZoom: 15, duration: 0 })
}

/** Внешний элемент принадлежит MapLibre (он сам двигает его через transform), вид и анимации - во внутренней кнопке */
function pinElement(id: string, price: number, approx: boolean, title: string) {
  const wrap = document.createElement('div')
  wrap.className = 'kmap-pin-wrap'
  if (id === props.selectedId) wrap.classList.add('is-active')
  wrap.dataset.id = id
  const el = document.createElement('button')
  el.type = 'button'
  el.className = 'kmap-pin'
  if (approx) el.classList.add('kmap-pin--approx')
  el.textContent = (approx ? '≈ ' : '') + formatPriceShort(price)
  el.setAttribute('aria-label', `${title}, ${formatPriceShort(price)}${approx ? `, ${tr('приблизительное место')}` : ''}`)
  el.addEventListener('click', (e) => {
    e.stopPropagation()
    emit('select', id)
  })
  wrap.append(el)
  return wrap
}

function clusterElement(count: number, clusterId: number, lngLat: [number, number]) {
  const el = document.createElement('button')
  el.type = 'button'
  el.className = 'kmap-cluster'
  el.setAttribute('aria-label', tr('Объявлений в группе: {n}. Приблизить', { n: count }))
  el.innerHTML = `<span aria-hidden="true">${count}</span>`
  el.addEventListener('click', async (e) => {
    e.stopPropagation()
    const src = map?.getSource(SOURCE) as GeoJSONSource | undefined
    if (!src) return
    const zoom = await src.getClusterExpansionZoom(clusterId)
    map?.easeTo({ center: lngLat, zoom: Math.min(zoom + 0.3, 17) })
  })
  return el
}

function syncMarkers() {
  if (!map || !maplibre || !map.getSource(SOURCE) || !map.isSourceLoaded(SOURCE)) return
  const seen = new Set<string>()
  for (const f of map.querySourceFeatures(SOURCE)) {
    const p = f.properties as Record<string, string | number | boolean>
    const lngLat = (f.geometry as { coordinates: number[] }).coordinates as [number, number]
    const key = p.cluster ? `c${p.cluster_id}-${p.point_count}` : `p${p.id}`
    if (seen.has(key)) continue
    seen.add(key)
    if (live.has(key)) continue
    const element = p.cluster
      ? clusterElement(Number(p.point_count), Number(p.cluster_id), lngLat)
      : pinElement(String(p.id), Number(p.price), p.approx === true || p.approx === 'true', String(p.title))
    live.set(key, new maplibre.Marker({ element }).setLngLat(lngLat).addTo(map))
  }
  for (const [key, marker] of live) {
    if (!seen.has(key)) { marker.remove(); live.delete(key) }
  }
}

function clearMarkers() {
  for (const m of live.values()) m.remove()
  live.clear()
}

const areaGeo = (pts: Coordinates[] | null | undefined) => ({
  type: 'FeatureCollection' as const,
  features: pts && pts.length >= 3
    ? [{ type: 'Feature' as const, properties: {}, geometry: { type: 'Polygon' as const, coordinates: [[...pts, pts[0]!].map(p => [p.lng, p.lat])] } }]
    : []
})

/** Источники и слои пересоздаются после каждой смены стиля (язык интерфейса) */
function addLayers() {
  if (!map || map.getSource(SOURCE)) return
  map.addSource(SOURCE, { type: 'geojson', data: collection(), cluster: true, clusterRadius: 52, clusterMaxZoom: 15 })
  // невидимый слой: без слоя MapLibre не грузит источник и querySourceFeatures пуст
  map.addLayer({ id: 'ads-probe', type: 'circle', source: SOURCE, paint: { 'circle-radius': 1, 'circle-opacity': 0 } })
  map.addSource('area', { type: 'geojson', data: areaGeo(props.area) })
  map.addLayer({ id: 'area-fill', type: 'fill', source: 'area', paint: { 'fill-color': '#fd4a00', 'fill-opacity': 0.08 } })
  map.addLayer({ id: 'area-line', type: 'line', source: 'area', paint: { 'line-color': '#fd4a00', 'line-width': 2 } })
  map.addSource('draw', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
  map.addLayer({ id: 'draw-line', type: 'line', source: 'draw', paint: { 'line-color': '#fd4a00', 'line-width': 3, 'line-dasharray': [2, 1] } })
  clearMarkers()
}

const emitBounds = () => {
  const b = map?.getBounds()
  if (b) emit('bounds', [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()])
}

async function init() {
  if (map || !mapEl.value) return
  try {
    const r = await create(mapEl.value, { center: ISRAEL_VIEW.center, zoom: ISRAEL_VIEW.zoom })
    map = r.map
    maplibre = r.maplibre
  } catch {
    failed.value = true
    return
  }
  map.addControl(new maplibre.NavigationControl({ showCompass: false }), 'top-right')
  map.on('style.load', addLayers)
  map.on('sourcedata', (e) => { if (e.sourceId === SOURCE && e.isSourceLoaded) syncMarkers() })
  map.on('moveend', () => { syncMarkers(); emitBounds() })
  map.on('idle', syncMarkers)
  // клик в пустое место снимает выбор
  map.on('click', () => emit('select', null))
  map.once('load', () => { fit(); emitBounds() })
  map.once('idle', () => (ready.value = true))
  setTimeout(() => (ready.value = true), 4000)
}
watchLocale(() => map)

watch(() => props.points, () => {
  const src = map?.getSource(SOURCE) as GeoJSONSource | undefined
  if (!src) return
  src.setData(collection())
  clearMarkers()
})
watch(() => props.fitKey, () => nextTick(fit))
watch(() => props.selectedId, (id) => {
  mapEl.value?.querySelectorAll<HTMLElement>('.kmap-pin-wrap').forEach(el => el.classList.toggle('is-active', !!id && el.dataset.id === id))
})
watch(() => props.area, (a) => { (map?.getSource('area') as GeoJSONSource | undefined)?.setData(areaGeo(a)) })

// --- рисование границы поиска: прозрачный слой поверх карты ловит указатель (мышь, палец, перо) ---
const drawing = ref(false)
let path: Coordinates[] = []
let pointerId: number | null = null

function startDraw() {
  drawing.value = true
  emit('select', null)
}
function cancelDraw() {
  drawing.value = false
  path = []
  pointerId = null
  ;(map?.getSource('draw') as GeoJSONSource | undefined)?.setData({ type: 'FeatureCollection', features: [] })
}
function pointAt(e: PointerEvent): Coordinates | null {
  if (!map || !mapEl.value) return null
  const r = mapEl.value.getBoundingClientRect()
  const ll = map.unproject([e.clientX - r.left, e.clientY - r.top])
  return { lat: ll.lat, lng: ll.lng }
}
function onDown(e: PointerEvent) {
  if (pointerId !== null) return
  pointerId = e.pointerId
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  const p = pointAt(e)
  path = p ? [p] : []
}
function onMove(e: PointerEvent) {
  if (e.pointerId !== pointerId) return
  const p = pointAt(e)
  if (!p) return
  path.push(p)
  ;(map?.getSource('draw') as GeoJSONSource | undefined)?.setData({
    type: 'FeatureCollection',
    features: [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: path.map(x => [x.lng, x.lat]) } }]
  })
}
function onUp(e: PointerEvent) {
  if (e.pointerId !== pointerId) return
  const area = simplifyPath(path)
  cancelDraw()
  if (area.length >= 3) emit('update:area', area)
}
function clearArea() {
  emit('update:area', null)
}

let io: IntersectionObserver | undefined
onMounted(() => {
  io = new IntersectionObserver(([e]) => {
    if (e?.isIntersecting) { io?.disconnect(); void init() }
  }, { rootMargin: '300px' })
  if (root.value) io.observe(root.value)
})
onBeforeUnmount(() => {
  io?.disconnect()
  clearMarkers()
  map?.remove()
  map = undefined
})

defineExpose({
  /** Показать точку (наведение на карточку списка): сдвиг, только если она за краем карты */
  reveal(p: Coordinates) {
    if (!map) return
    const b = map.getBounds()
    if (!b.contains([p.lng, p.lat])) map.easeTo({ center: [p.lng, p.lat] })
  }
})
</script>

<template>
  <div ref="root" class="amap" @keydown.esc="drawing ? cancelDraw() : emit('select', null)">
    <div ref="mapEl" class="amap__map kmap" :class="{ 'amap__map--ready': ready }" role="region" :aria-label="tr('Карта объявлений')" />

    <div v-if="!ready && !failed" class="amap__loading" role="status">
      <Icon name="kango:map-24" size="32" />
      <span>{{ tr('Загрузка карты...') }}</span>
    </div>
    <p v-if="failed" class="amap__note" role="alert">{{ tr('Не удалось загрузить карту. Обновите страницу.') }}</p>
    <p v-else-if="ready && tilesReady === false" class="amap__note">{{ tr('Подложка карты недоступна. Метки объявлений показаны.') }}</p>

    <div v-if="drawable && ready" class="amap__tools">
      <template v-if="drawing">
        <span class="amap__hint">{{ tr('Обведите нужный район пальцем или мышью') }}</span>
        <button type="button" class="amap__btn" @click="cancelDraw">{{ tr('Отмена') }}</button>
      </template>
      <template v-else>
        <button type="button" class="amap__btn amap__btn--main" @click="startDraw">
          <Icon name="kango:map-pin-16" size="16" />{{ area?.length ? tr('Обвести заново') : tr('Обвести область') }}
        </button>
        <button v-if="area?.length" type="button" class="amap__btn" @click="clearArea">{{ tr('Сбросить область') }}</button>
      </template>
    </div>
    <div
      v-if="drawing"
      class="amap__draw"
      :aria-label="tr('Обведите нужный район')"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointercancel="cancelDraw"
    />
    <div v-if="loading && ready" class="amap__busy" role="status">{{ tr('Обновляем...') }}</div>
    <slot />
  </div>
</template>

<style scoped>
.amap { position: relative; overflow: hidden; background: #f6f5f1; isolation: isolate; }
.amap__map { position: absolute; inset: 0; opacity: 0; transition: opacity 0.3s ease-out; }
.amap__map--ready { opacity: 1; }
@media (prefers-reduced-motion: reduce) {
  .amap__map { transition: none; }
}
.amap__loading { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: var(--color-label-gray); font-size: var(--text-14-16); }
.amap__note { position: absolute; inset-inline: 12px; bottom: 36px; z-index: 3; margin: 0; padding: 8px 12px; border-radius: var(--radius-md); background: color-mix(in srgb, var(--color-label-primary) 80%, transparent); color: var(--color-label-white); font-size: var(--text-13-16); line-height: var(--leading-13-16); }
.amap__tools { position: absolute; top: 12px; inset-inline-start: 12px; z-index: 4; display: flex; flex-wrap: wrap; align-items: center; gap: 8px; max-width: calc(100% - 72px); }
.amap__btn { display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 14px; border: 0; border-radius: var(--radius-pill); background: var(--color-background); box-shadow: 0 2px 8px color-mix(in srgb, var(--color-label-primary) 18%, transparent); color: var(--color-label-primary); font-family: inherit; font-size: var(--text-14-16); font-weight: var(--font-weight-medium); cursor: pointer; }
.amap__btn--main { background: var(--color-label-primary); color: var(--color-label-white); }
.amap__btn:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
.amap__hint { padding: 8px 12px; border-radius: var(--radius-md); background: var(--color-background); box-shadow: 0 2px 8px color-mix(in srgb, var(--color-label-primary) 18%, transparent); font-size: var(--text-13-16); }
.amap__draw { position: absolute; inset: 0; z-index: 3; cursor: crosshair; touch-action: none; }
.amap__busy { position: absolute; top: 12px; left: 50%; z-index: 4; padding: 6px 12px; border-radius: var(--radius-pill); background: var(--color-background); box-shadow: 0 2px 8px color-mix(in srgb, var(--color-label-primary) 18%, transparent); font-size: var(--text-13-16); transform: translateX(-50%); }
</style>

<style>
/* Метки создаются вне Vue (MapLibre Marker), поэтому стили не scoped, с префиксом .kmap */
.kmap .kmap-pin {
  display: block;
  padding: 5px 9px;
  border: 0;
  border-radius: var(--radius-pill);
  background: var(--color-background);
  box-shadow: 0 1px 4px color-mix(in srgb, var(--color-label-primary) 30%, transparent);
  color: var(--color-label-primary);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
  line-height: 16px;
  white-space: nowrap;
  cursor: pointer;
  transition: transform 0.12s ease-out, background-color 0.12s ease-out;
}
.kmap .kmap-pin--approx { outline: 1.5px dashed var(--color-fill-gray); outline-offset: -3px; }
.kmap .kmap-pin-wrap.is-active { z-index: 2; }
.kmap .kmap-pin-wrap.is-active .kmap-pin { background: var(--color-fill-primary); color: var(--color-label-white); transform: scale(1.12); }
.kmap .kmap-pin:focus-visible, .kmap .kmap-cluster:focus-visible { outline: 3px solid var(--color-fill-color-3); outline-offset: 2px; }
.kmap .kmap-cluster { display: block; width: 44px; height: 44px; padding: 0; border: 0; background: none; cursor: pointer; }
.kmap .kmap-cluster span { display: grid; width: 44px; height: 44px; place-items: center; border: 3px solid var(--color-background); border-radius: 50%; background: var(--color-fill-primary); box-shadow: 0 2px 6px color-mix(in srgb, var(--color-label-primary) 30%, transparent); color: var(--color-label-white); font-family: var(--font-sans); font-size: 14px; font-weight: var(--font-weight-semibold); }
@media (hover: hover) and (pointer: fine) {
  .kmap .kmap-pin-wrap:not(.is-active) .kmap-pin:hover { background: var(--color-label-primary); color: var(--color-label-white); }
  .kmap .kmap-cluster:hover span { transform: scale(1.08); }
}
.kmap .maplibregl-ctrl-attrib { font-size: 11px; }
</style>
