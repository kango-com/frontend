<script setup lang="ts">
import { adsApi } from '~/api'
import type { AdsQuery, Coordinates, MapAd } from '~/types'
import { formatAdsCount, formatPrice } from '~/utils/format'
import { type Bounds, inBounds } from '~/utils/geo'

/**
 * Поиск на карте (Договор, Прил. 1, п. 9): те же фильтры, что у списка; результаты ограничены видимой областью карты
 * или нарисованной границей. Desktop - список слева и карта справа; телефон - карта на весь экран, карточка выбранного снизу.
 */
const props = defineProps<{ query: AdsQuery, /** Объявление, на котором открыть карту */ focusId?: string }>()
const emit = defineEmits<{ list: [] }>()

const { locale } = useI18n()
const favorites = useFavoritesStore()
const ui = useUiStore()

const points = ref<MapAd[]>([])
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const area = ref<Coordinates[] | null>(null)
const bounds = ref<Bounds | null>(null)
const selectedId = ref<string | null>(null)
const hoverId = ref<string | null>(null)
const mapRef = ref<{ reveal: (p: Coordinates) => void }>()

let ctrl: AbortController | undefined
async function load() {
  ctrl?.abort()
  ctrl = new AbortController()
  status.value = 'loading'
  try {
    points.value = await adsApi.map(props.query, area.value ?? undefined, ctrl.signal)
    status.value = 'success'
  } catch (e) {
    if ((e as { code?: string }).code !== 'aborted') status.value = 'error'
  }
}
const queryJson = computed(() => JSON.stringify(props.query))
watch([queryJson, area], load, { immediate: true })
// новый поиск или новая граница - карта подстраивает масштаб; движение карты пользователем - нет
const fitKey = computed(() => `${queryJson.value}|${area.value?.length ?? 0}|${status.value === 'success'}`)

// в списке - то, что видно на карте (граница уже учтена сервером)
const visible = computed(() => (bounds.value ? points.value.filter(p => inBounds(p.coordinates, bounds.value!)) : points.value))
const LIMIT_STEP = 40
const limit = ref(LIMIT_STEP)
watch(visible, () => { limit.value = LIMIT_STEP })
const shown = computed(() => visible.value.slice(0, limit.value))
const countText = computed(() => {
  const n = visible.value.length
  return area.value?.length ? tr('{count} в обведённой области', { count: formatAdsCount(n, locale.value as 'ru') }) : tr('{count} на карте', { count: formatAdsCount(n, locale.value as 'ru') })
})

const selected = computed(() => points.value.find(p => p.id === selectedId.value) ?? null)
const focusPoint = computed(() => (props.focusId ? points.value.find(p => p.id === props.focusId)?.coordinates ?? null : null))
watch(focusPoint, (p) => { if (p && props.focusId) selectedId.value = props.focusId }, { immediate: true })
const highlight = computed(() => hoverId.value ?? selectedId.value)

// выбор метки: на desktop прокручиваем список к карточке
const listEl = ref<HTMLElement>()
watch(selectedId, async (id) => {
  if (!id) return
  await nextTick()
  listEl.value?.querySelector(`[data-id="${id}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
})
function hover(p: MapAd | null) {
  hoverId.value = p?.id ?? null
  if (p) mapRef.value?.reveal(p.coordinates)
}

async function toggleFavorite(id: string) {
  const p = points.value.find(x => x.id === id)
  if (!p) return
  const r = await favorites.toggle(p)
  if (r === 'auth-required') { ui.openLogin(); return }
  points.value = points.value.map(x => (x.id === id ? { ...x, isFavorite: r === 'added' } : x))
}

// на телефоне список открывается шторкой поверх карты
const sheet = ref(false)

// высота блока = от его верха до низа экрана: карта целиком помещается на первом экране, а не обрезается снизу
const rootEl = ref<HTMLElement>()
const blockH = ref<number>()
const safeBottom = () => {
  const probe = document.createElement('div')
  probe.style.cssText = 'position:fixed;bottom:0;height:env(safe-area-inset-bottom,0px);visibility:hidden'
  document.body.append(probe)
  const h = probe.getBoundingClientRect().height
  probe.remove()
  return h
}
function measure() {
  if (!rootEl.value) return
  const top = rootEl.value.getBoundingClientRect().top + window.scrollY
  // ниже 1380 внизу окна фиксирована нижняя панель навигации (56px + безопасная зона): карта не должна уходить под неё
  const tabbar = window.innerWidth < 1380 ? 56 + safeBottom() : 0
  // телефон: карта занимает весь экран между шапкой (50px) и нижней панелью, фильтры остаются выше - к ним прокручивают
  blockH.value = Math.round(window.innerWidth < 768 ? window.innerHeight - 50 - 8 - tabbar : window.innerHeight - top - 16 - tabbar)
}
let ro: ResizeObserver | undefined
onMounted(() => {
  measure()
  // телефон: при открытии карты прокручиваем страницу так, чтобы карта встала под шапку
  if (window.innerWidth < 768) nextTick(() => rootEl.value?.scrollIntoView({ block: 'start' }))
  ro = new ResizeObserver(measure)
  ro.observe(document.documentElement)
  window.addEventListener('resize', measure)
})
onBeforeUnmount(() => {
  ro?.disconnect()
  window.removeEventListener('resize', measure)
})
</script>

<template>
  <div ref="rootEl" class="msr" :style="blockH ? { height: `${blockH}px` } : undefined">
    <aside class="msr__side" :aria-label="tr('Объявления на карте')">
      <p class="msr__count" aria-live="polite">
        <template v-if="status === 'loading' && !points.length">{{ tr('Загрузка...') }}</template>
        <template v-else>{{ countText }}</template>
      </p>
      <p v-if="status === 'error'" class="msr__note" role="alert">
        {{ tr('Не удалось загрузить объявления.') }} <KTextButton size="sm" @click="load">{{ tr('Повторить') }}</KTextButton>
      </p>
      <p v-else-if="status === 'success' && !visible.length" class="msr__note">{{ tr('В этой области ничего нет. Отдалите карту или измените фильтры.') }}</p>
      <ul ref="listEl" class="msr__list">
        <li v-for="p in shown" :key="p.id" :data-id="p.id" :class="{ 'msr__item--on': highlight === p.id }" @mouseenter="hover(p)" @mouseleave="hover(null)" @focusin="hover(p)">
          <KAdCard compact :title="p.title" :price="formatPrice(p.price)" :variable="!!(p.price.from || (p.price.period && p.price.period !== 'total'))" :location="p.location" :image="p.image" :to="`/ad/${p.id}`" :favorite="p.isFavorite" @toggle-favorite="toggleFavorite(p.id)" />
        </li>
      </ul>
      <KButton v-if="visible.length > shown.length" variant="outline" block @click="limit += LIMIT_STEP">{{ tr('Показать ещё') }}</KButton>
    </aside>

    <AdsMap
      ref="mapRef"
      v-model:area="area"
      class="msr__map"
      :points="points"
      :selected-id="highlight"
      :fit-key="fitKey"
      :focus="focusPoint"
      :loading="status === 'loading' && !!points.length"
      @select="selectedId = $event"
      @bounds="bounds = $event"
    >
      <!-- телефон и планшет: карточка выбранного объявления и кнопка списка поверх карты -->
      <div class="msr__float">
        <div v-if="selected" class="msr__card">
          <KAdCard :title="selected.title" :price="formatPrice(selected.price)" :variable="!!(selected.price.from || (selected.price.period && selected.price.period !== 'total'))" :location="selected.location" :image="selected.image" :to="`/ad/${selected.id}`" :favorite="selected.isFavorite" @toggle-favorite="toggleFavorite(selected.id)" />
          <KIconButton class="msr__close" type="close" :label="tr('Закрыть')" @click="selectedId = null" />
        </div>
        <div class="msr__bar">
          <button type="button" class="msr__pill" @click="sheet = true">{{ countText }}</button>
          <button type="button" class="msr__pill msr__pill--dark" @click="emit('list')">{{ tr('Списком') }}</button>
        </div>
      </div>
    </AdsMap>

    <KModalSheet v-model="sheet" :title="countText">
      <ul class="msr__sheet">
        <li v-for="p in shown" :key="p.id">
          <KAdCard :title="p.title" :price="formatPrice(p.price)" :variable="!!(p.price.from || (p.price.period && p.price.period !== 'total'))" :location="p.location" :image="p.image" :to="`/ad/${p.id}`" :favorite="p.isFavorite" @toggle-favorite="toggleFavorite(p.id)" />
        </li>
      </ul>
      <KButton v-if="visible.length > shown.length" variant="outline" block @click="limit += LIMIT_STEP">{{ tr('Показать ещё') }}</KButton>
    </KModalSheet>
  </div>
</template>

<style scoped>
.msr { position: relative; scroll-margin-top: 58px; display: flex; height: calc(100dvh - var(--header-h) - 56px - 210px); min-height: 360px; margin-inline: -16px; }
.msr__side { display: none; }
.msr__map { flex: 1; min-width: 0; }
.msr__float { position: absolute; inset: auto 12px 12px; z-index: 5; display: flex; flex-direction: column; gap: 8px; pointer-events: none; }
.msr__float > * { pointer-events: auto; }
.msr__card { position: relative; display: flex; max-width: 360px; padding: 8px; border-radius: var(--radius-md); background: var(--color-background); box-shadow: 0 4px 16px color-mix(in srgb, var(--color-label-primary) 18%, transparent); }
.msr__card > :first-child { flex: 1; min-width: 0; }
.msr__close { position: absolute; top: 4px; inset-inline-end: 4px; z-index: 1; background: var(--color-background); border-radius: 50%; }
.msr__bar { display: flex; justify-content: center; gap: 8px; }
.msr__pill { height: 40px; padding: 0 16px; border: 0; border-radius: var(--radius-pill); background: var(--color-background); box-shadow: 0 2px 8px color-mix(in srgb, var(--color-label-primary) 20%, transparent); color: var(--color-label-primary); font-family: inherit; font-size: var(--text-14-16); font-weight: var(--font-weight-medium); cursor: pointer; }
.msr__pill--dark { background: var(--color-label-primary); color: var(--color-label-white); }
.msr__pill:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
.msr__sheet { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin: 0 0 12px; padding: 0; list-style: none; }
.msr__count { margin: 0; color: var(--color-label-secondary); font-size: var(--text-14-16); }
.msr__note { margin: 0; color: var(--color-label-secondary); font-size: var(--text-14-16); line-height: 20px; }

/* desktop: список слева, карта справа; плавающих карточки и кнопок нет */
@media (min-width: 1380px) {
  .msr { gap: 20px; height: calc(100dvh - var(--header-h) - 48px); min-height: 440px; margin-inline: 0; }
  .msr__side { display: flex; flex: 0 0 400px; flex-direction: column; gap: 12px; padding: 4px; overflow-y: auto; scrollbar-width: thin; }
  .msr__list { display: flex; flex-direction: column; gap: 10px; margin: 0; padding: 0; list-style: none; }
  .msr__list > li { border-radius: var(--radius-md); outline: 2px solid transparent; outline-offset: 0; transition: outline-color 0.15s ease-out; }
  .msr__list > .msr__item--on { outline-color: var(--color-stroke-primary); }
  .msr__map { border-radius: var(--radius-md); }
  .msr__float { display: none; }
}
@media (min-width: 768px) and (max-width: 1379px) {
  .msr { margin-inline: 0; border-radius: var(--radius-md); overflow: hidden; }
  .msr__card { max-width: 420px; }
}
</style>
