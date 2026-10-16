<script setup lang="ts">
import type { City } from '~/types'

const city = useCityStore()
const ui = useUiStore()

const open = computed({
  get: () => ui.isOpen('city'),
  set: (v) => { if (v) ui.open('city'); else ui.close('city') }
})

const query = ref('')
const cityList = ref<{ focusFirst: () => void }>()
/** Выбранный в списке город применяется кнопкой «Выбрать» */
const pending = ref<City>(city.current)
let timer: ReturnType<typeof setTimeout> | undefined

// список городов грузим заранее (шторка живёт в layout), чтобы при открытии он уже был готов
onMounted(() => { city.loadPopular(); city.search('') })

watch(open, async (v) => {
  if (!v) return
  pending.value = city.current
  query.value = ''
  await city.loadPopular()
  // общий список не должен оставаться пустым после сбоя запроса
  if (!city.results.length) await city.search('')
})

watch(query, (q) => {
  clearTimeout(timer)
  timer = setTimeout(() => city.search(q.trim()), 200)
})
onBeforeUnmount(() => clearTimeout(timer))

const searching = computed(() => !!query.value.trim())
/** Без запроса: популярные города сверху, остальные по алфавиту ниже; с запросом порядок поиска */
const popularList = computed(() => (searching.value ? [] : city.popular))
const restList = computed(() => {
  if (searching.value) return city.results
  const popularIds = new Set(city.popular.map(c => c.id))
  return city.results.filter(c => !popularIds.has(c.id))
})
const list = computed(() => [...popularList.value, ...restList.value])

function confirm() {
  city.select(pending.value)
  open.value = false
}

function first() {
  const c = list.value[0]
  if (c) pending.value = c
}
</script>

<template>
  <KModalSheet v-model="open" :label="tr('Какой город?')" dialog full-mobile>
    <div class="city-selector">
      <div class="city-selector__top">
        <KSearchField v-model="query" :placeholder="tr('Какой город?')" :label="tr('Поиск города')" @submit="first" @keydown.down.prevent="cityList?.focusFirst()" />
        <!-- на 375 окно полноэкранное, закрыть его можно только кнопкой; от 768 закрывает Esc и клик по фону -->
        <KTextButton class="city-selector__cancel" size="md" @click="open = false">{{ tr('Отмена') }}</KTextButton>
      </div>
      <div class="scroll">
        <template v-if="popularList.length">
          <h3 class="city-selector__group">{{ tr('Популярные') }}</h3>
          <CityList ref="cityList" :cities="popularList" :selected-id="pending.id" @select="pending = $event" />
          <h3 class="city-selector__group">{{ tr('Все города') }}</h3>
          <CityList v-if="restList.length" :cities="restList" :selected-id="pending.id" @select="pending = $event" />
          <p v-else-if="!city.searching" class="city-selector__note" role="alert">
            {{ tr('Не удалось загрузить список городов.') }}
            <KTextButton size="sm" @click="city.search('')">{{ tr('Повторить') }}</KTextButton>
          </p>
          <div v-else class="city-selector__bones" aria-busy="true"><span v-for="n in 4" :key="n" /></div>
        </template>
        <CityList v-else ref="cityList" :cities="restList" :selected-id="pending.id" :loading="city.searching" @select="pending = $event" />
      </div>
      <!-- кнопка появляется, когда выбран другой город (как в макете) -->
      <div v-if="pending.id !== city.current.id" class="city-selector__foot">
        <KButton block variant="outline" @click="confirm">{{ tr('Выбрать') }}</KButton>
      </div>
    </div>
  </KModalSheet>
</template>

<style scoped>
.city-selector { display: flex; flex-direction: column; gap: 16px; min-height: 0; flex: 1; }
.city-selector__note { margin: 0; padding: 16px 12px; color: var(--color-label-secondary); font-size: var(--text-14-16); line-height: var(--leading-14-16); }
@media (min-width: 768px) {
  .city-selector { padding: 12px 12px 4px; }
  .city-selector__cancel { display: none; }
}
.city-selector__bones { display: flex; flex-direction: column; gap: 8px; padding: 8px 12px; }
.city-selector__bones span { height: 28px; border-radius: var(--radius-md); background: var(--color-fill-gray-3); animation: city-pulse 1.2s ease-in-out infinite; }
@keyframes city-pulse { 50% { opacity: 0.5; } }
@media (prefers-reduced-motion: reduce) { .city-selector__bones span { animation: none; } }
.city-selector__group { margin: 16px 0 4px; padding-inline: 12px; color: var(--color-label-secondary); font-size: var(--text-12-16); line-height: var(--leading-12-16); font-weight: var(--font-weight-medium); text-transform: uppercase; letter-spacing: 0.04em; }
.city-selector__group:first-child { margin-top: 0; }
.city-selector__top { display: flex; align-items: center; gap: 12px; }
.city-selector__top :deep(.ksf) { flex: 1; min-width: 0; }
.city-selector__foot { padding: 8px 0 calc(8px + env(safe-area-inset-bottom)); }
.scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  margin-inline: -8px;
  padding: 0 8px 20px;
  /* мягкое затухание у нижнего края: видно, что список продолжается */
  -webkit-mask-image: linear-gradient(to bottom, #000 calc(100% - 28px), transparent);
  mask-image: linear-gradient(to bottom, #000 calc(100% - 28px), transparent);
}
@media (min-width: 768px) {
  .scroll { flex: none; max-height: 380px; }
}
</style>
