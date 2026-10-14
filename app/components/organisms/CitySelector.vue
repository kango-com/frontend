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

watch(open, async (v) => {
  if (!v) return
  pending.value = city.current
  query.value = ''
  await Promise.all([city.loadPopular(), city.search('')])
})

watch(query, (q) => {
  clearTimeout(timer)
  timer = setTimeout(() => city.search(q.trim()), 200)
})
onBeforeUnmount(() => clearTimeout(timer))

/** Без запроса популярные города сверху, остальные по алфавиту; с запросом порядок поиска */
const list = computed(() => {
  if (query.value.trim()) return city.results
  const popularIds = new Set(city.popular.map(c => c.id))
  return [...city.popular, ...city.results.filter(c => !popularIds.has(c.id))]
})

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
        <KTextButton size="md" @click="open = false">{{ tr('Отмена') }}</KTextButton>
      </div>
      <div class="scroll">
        <CityList ref="cityList" :cities="list" :selected-id="pending.id" :loading="city.searching" @select="pending = $event" />
      </div>
      <!-- кнопка появляется, когда выбран другой город (как в макете) -->
      <div v-if="pending.id !== city.current.id" class="city-selector__foot">
        <KButton block variant="outline" @click="confirm">{{ tr('Выбрать') }}</KButton>
      </div>
    </div>
  </KModalSheet>
</template>

<style scoped>
.city-selector { display: flex; flex-direction: column; gap: 12px; min-height: 0; flex: 1; }
.city-selector__top { display: flex; align-items: center; gap: 12px; }
.city-selector__top :deep(.ksf) { flex: 1; min-width: 0; }
.city-selector__foot { padding: 8px 0 calc(8px + env(safe-area-inset-bottom)); }
.scroll { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; }
@media (min-width: 768px) {
  .scroll { flex: none; max-height: 320px; }
}
</style>
