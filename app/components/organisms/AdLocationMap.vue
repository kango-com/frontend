<script setup lang="ts">
import type { Map as MapLibreMap } from 'maplibre-gl'
import type { Coordinates } from '~/types'
import { circlePolygon, routeLinks } from '~/utils/geo'

/**
 * Карта в карточке объявления (Договор, Прил. 1, п. 9): точка объекта или приблизительная область, если автор скрыл адрес.
 * «Открыть на карте» ведёт в поиск на карте Kango, маршрут - во внешние приложения. Карта грузится, когда блок подходит к экрану.
 */
const props = defineProps<{
  adId: string
  title: string
  point: Coordinates
  /** Автор скрыл точный адрес: точка - центр области, рисуется круг */
  approximate?: boolean
  address?: string
  /** Тип сделки: карта откроется с тем же фильтром, иначе объявление может не попасть в выдачу */
  deal?: 'rent' | 'sale'
}>()

const APPROX_RADIUS = 400
const { create, watchLocale } = useMapLibre()
const root = ref<HTMLElement>()
const mapEl = ref<HTMLElement>()
const ready = ref(false)
let map: MapLibreMap | undefined

const links = computed(() => routeLinks(props.point))

async function init() {
  if (map || !mapEl.value) return
  const center: [number, number] = [props.point.lng, props.point.lat]
  const r = await create(mapEl.value, { center, zoom: props.approximate ? 14.3 : 15.5 })
  map = r.map
  map.addControl(new r.maplibre.NavigationControl({ showCompass: false }), 'top-right')
  const addShape = () => {
    if (!map || map.getSource('place')) return
    if (props.approximate) {
      map.addSource('place', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [circlePolygon(props.point, APPROX_RADIUS)] } } })
      map.addLayer({ id: 'place-fill', type: 'fill', source: 'place', paint: { 'fill-color': '#ff571f', 'fill-opacity': 0.12 } })
      map.addLayer({ id: 'place-line', type: 'line', source: 'place', paint: { 'line-color': '#ff571f', 'line-width': 2, 'line-dasharray': [2, 1.5] } })
    }
  }
  map.on('style.load', addShape)
  if (!props.approximate) {
    const el = document.createElement('div')
    el.className = 'kmap-place'
    el.setAttribute('role', 'img')
    el.setAttribute('aria-label', props.title)
    new r.maplibre.Marker({ element: el, anchor: 'bottom' }).setLngLat(center).addTo(map)
  }
  map.once('idle', () => (ready.value = true))
  setTimeout(() => (ready.value = true), 4000)
}
watchLocale(() => map)

let io: IntersectionObserver | undefined
onMounted(() => {
  io = new IntersectionObserver(([e]) => {
    if (e?.isIntersecting) { io?.disconnect(); void init() }
  }, { rootMargin: '200px' })
  if (root.value) io.observe(root.value)
})
onBeforeUnmount(() => {
  io?.disconnect()
  map?.remove()
  map = undefined
})
</script>

<template>
  <section ref="root" class="alm" aria-labelledby="alm-title">
    <h2 id="alm-title" class="alm__title">{{ tr('На карте') }}</h2>
    <p v-if="approximate" class="alm__note">{{ tr('Автор скрыл точный адрес. Показан район в радиусе около 400 м.') }}</p>
    <p v-else-if="address" class="alm__note">{{ trl(address) }}</p>
    <div class="alm__box">
      <div ref="mapEl" class="alm__map kmap" :class="{ 'alm__map--ready': ready }" role="region" :aria-label="tr('Карта: {title}', { title })" />
      <div v-if="!ready" class="alm__loading" aria-hidden="true"><Icon name="kango:map-pin-16" size="24" /></div>
    </div>
    <div class="alm__actions">
      <KButton :to="`/realty?view=map&focus=${adId}${deal ? `&deal=${deal}` : ''}`" variant="outline" size="sm">{{ tr('Открыть на карте') }}</KButton>
      <KButton :href="links.waze" target="_blank" rel="noopener" variant="plain" size="sm">{{ tr('Маршрут в Waze') }}</KButton>
      <KButton :href="links.google" target="_blank" rel="noopener" variant="plain" size="sm">{{ tr('Маршрут в Google Maps') }}</KButton>
    </div>
  </section>
</template>

<style scoped>
.alm { display: flex; flex-direction: column; gap: 8px; }
.alm__title { margin: 0; color: var(--color-label-primary); font-size: var(--text-17-20); line-height: var(--leading-17-20); font-weight: var(--font-weight-medium); }
.alm__note { margin: 0; color: var(--color-label-secondary); font-size: var(--text-14-16); line-height: 20px; }
.alm__box { position: relative; overflow: hidden; aspect-ratio: 16 / 10; border-radius: var(--radius-md); background: #f6f5f1; isolation: isolate; }
.alm__map { position: absolute; inset: 0; opacity: 0; transition: opacity 0.3s ease-out; }
.alm__map--ready { opacity: 1; }
.alm__loading { position: absolute; inset: 0; display: grid; place-items: center; color: var(--color-label-gray); }
.alm__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 16px; }
@media (min-width: 768px) {
  .alm__box { aspect-ratio: 2 / 1; }
}
</style>

<style>
/* Метка объекта (MapLibre Marker, вне Vue): оранжевая капля с белой точкой */
.kmap .kmap-place { width: 30px; height: 40px; background: no-repeat center / contain url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 40'%3E%3Cpath d='M15 0C6.7 0 0 6.6 0 14.8 0 25.9 15 40 15 40s15-14.1 15-25.2C30 6.6 23.3 0 15 0z' fill='%23fd4a00'/%3E%3Ccircle cx='15' cy='15' r='6' fill='%23fff'/%3E%3C/svg%3E"); filter: drop-shadow(0 2px 3px rgb(0 0 0 / 0.3)); }
</style>
