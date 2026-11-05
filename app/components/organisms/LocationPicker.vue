<script setup lang="ts">
import type { Map as MapLibreMap, Marker } from 'maplibre-gl'
import { geoApi } from '~/api'
import type { Coordinates } from '~/types'
import { ISRAEL_VIEW } from '~/utils/map-style'

/**
 * Точка объекта при подаче (Договор, Прил. 1, п. 9 «Адрес и координаты»): адрес геокодируется в точку на карте,
 * автор проверяет её и при необходимости сдвигает метку вручную (перетаскиванием или кликом по карте). Координаты уходят в объявление.
 */
const props = defineProps<{ city?: string, address?: string }>()
const point = defineModel<Coordinates | undefined>()

const { create, watchLocale } = useMapLibre()
const root = ref<HTMLElement>()
const mapEl = ref<HTMLElement>()
const ready = ref(false)
const status = ref<'idle' | 'searching' | 'found' | 'city' | 'missing'>('idle')
/** Метку двигали руками после последнего найденного адреса: новый адрес её не перезаписывает, пока автор не попросит */
const manual = ref(false)
let map: MapLibreMap | undefined
let marker: Marker | undefined

function place(p: Coordinates, zoom?: number) {
  if (!map) return
  marker?.setLngLat([p.lng, p.lat])
  map.easeTo({ center: [p.lng, p.lat], ...(zoom ? { zoom } : {}) })
}

let ctrl: AbortController | undefined
let timer: ReturnType<typeof setTimeout> | undefined
async function geocode(force = false) {
  if (!props.city) return
  if (manual.value && !force) return
  ctrl?.abort()
  ctrl = new AbortController()
  status.value = 'searching'
  try {
    const r = await geoApi.geocode(props.city, props.address ?? '', ctrl.signal)
    point.value = r.point
    manual.value = false
    status.value = r.exact ? 'found' : 'city'
    place(r.point, r.exact ? 16 : 13)
  } catch (e) {
    if ((e as { code?: string }).code !== 'aborted') status.value = 'missing'
  }
}
// адрес печатают по буквам: геокодируем, когда ввод затих
watch(() => [props.city, props.address], () => {
  clearTimeout(timer)
  timer = setTimeout(() => geocode(), 600)
})

async function init() {
  if (map || !mapEl.value) return
  const start = point.value
  const r = await create(mapEl.value, start ? { center: [start.lng, start.lat], zoom: 16 } : { center: ISRAEL_VIEW.center, zoom: ISRAEL_VIEW.zoom })
  map = r.map
  map.addControl(new r.maplibre.NavigationControl({ showCompass: false }), 'top-right')
  const el = document.createElement('div')
  el.className = 'kmap-place'
  el.setAttribute('role', 'img')
  el.setAttribute('aria-label', tr('Место объекта'))
  marker = new r.maplibre.Marker({ element: el, anchor: 'bottom', draggable: true })
    .setLngLat(start ? [start.lng, start.lat] : ISRAEL_VIEW.center)
    .addTo(map)
  marker.on('dragend', () => {
    const ll = marker!.getLngLat()
    point.value = { lat: +ll.lat.toFixed(6), lng: +ll.lng.toFixed(6) }
    manual.value = true
  })
  // клик по карте переносит метку (удобнее, чем тянуть на телефоне)
  map.on('click', (e) => {
    marker?.setLngLat(e.lngLat)
    point.value = { lat: +e.lngLat.lat.toFixed(6), lng: +e.lngLat.lng.toFixed(6) }
    manual.value = true
  })
  map.once('idle', () => (ready.value = true))
  setTimeout(() => (ready.value = true), 4000)
  if (!start) geocode()
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
  clearTimeout(timer)
  ctrl?.abort()
  map?.remove()
  map = undefined
})

const hint = computed(() => ({
  idle: tr('Укажите город и адрес - метка встанет сама. Её можно передвинуть.'),
  searching: tr('Ищем адрес на карте...'),
  found: tr('Проверьте метку. Если она стоит неточно, перетащите её или нажмите на нужное место.'),
  city: tr('Нашли только город. Укажите улицу и дом или поставьте метку вручную.'),
  missing: tr('Адрес не найден. Поставьте метку вручную: нажмите на нужное место на карте.')
})[manual.value ? 'found' : status.value])
</script>

<template>
  <div ref="root" class="lpk">
    <p class="lpk__hint" :class="{ 'lpk__hint--warn': status === 'missing' }" aria-live="polite">
      {{ manual ? tr('Метка поставлена вручную.') : hint }}
      <button v-if="manual && address" type="button" class="lpk__link" @click="geocode(true)">{{ tr('Найти по адресу заново') }}</button>
    </p>
    <div class="lpk__box">
      <div ref="mapEl" class="lpk__map kmap" :class="{ 'lpk__map--ready': ready }" role="region" :aria-label="tr('Карта: место объекта')" />
      <div v-if="!ready" class="lpk__loading" aria-hidden="true"><Icon name="kango:map-pin-16" size="24" /></div>
    </div>
  </div>
</template>

<style scoped>
.lpk { display: flex; flex-direction: column; gap: 8px; }
.lpk__hint { margin: 0; color: var(--color-label-secondary); font-size: var(--text-13-16); line-height: 18px; }
.lpk__hint--warn { color: var(--color-fill-error); }
.lpk__link { padding: 0; border: 0; background: none; color: var(--color-fill-color-3); font: inherit; text-decoration: underline; cursor: pointer; }
.lpk__box { position: relative; overflow: hidden; aspect-ratio: 4 / 3; border-radius: var(--radius-md); background: #f6f5f1; isolation: isolate; }
.lpk__map { position: absolute; inset: 0; opacity: 0; transition: opacity 0.3s ease-out; }
.lpk__map--ready { opacity: 1; }
.lpk__loading { position: absolute; inset: 0; display: grid; place-items: center; color: var(--color-label-gray); }
@media (min-width: 768px) {
  .lpk__box { aspect-ratio: 16 / 9; }
}
</style>
