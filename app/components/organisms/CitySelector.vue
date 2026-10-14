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
  <KModalSheet v-model="open" title="Какой город?" action="Отмена" dialog @action="open = false">
    <div class="city-selector">
      <KSearchField v-model="query" placeholder="Поиск города" label="Поиск города" @submit="first" @keydown.down.prevent="cityList?.focusFirst()" />
      <div class="scroll">
        <CityList ref="cityList" :cities="list" :selected-id="pending.id" :loading="city.searching" @select="pending = $event" />
      </div>
      <KButton block @click="confirm">Выбрать</KButton>
    </div>
  </KModalSheet>
</template>

<style scoped>
.city-selector { display: flex; flex-direction: column; gap: 12px; }
.scroll { max-height: 45dvh; overflow-y: auto; overscroll-behavior: contain; }
@media (min-width: 768px) {
  .scroll { max-height: 320px; }
}
</style>
