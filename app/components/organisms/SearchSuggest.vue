<script setup lang="ts">
const props = defineProps<{
  /** Текст в поле поиска: пустой показывает историю, непустой подсказки */
  query: string
}>()

const emit = defineEmits<{ pick: [text: string, categoryTitle?: string] }>()

const search = useSearchStore()
const root = ref<HTMLElement>()
let timer: ReturnType<typeof setTimeout> | undefined

onMounted(() => { search.loadHistory(); search.loadPopular() })

// дебаунс 200 мс, предыдущий запрос отменяется в сторе
watch(() => props.query, (q) => {
  clearTimeout(timer)
  if (!q.trim()) { search.suggest(''); return }
  timer = setTimeout(() => search.suggest(q), 200)
}, { immediate: true })
onBeforeUnmount(() => { clearTimeout(timer); search.reset() })

const trimmed = computed(() => props.query.trim())
const showHistory = computed(() => !trimmed.value)

/** История сверху (до 5 последних), под ней популярные запросы без повторов: панель всегда содержит релевантные варианты */
const recent = computed(() => search.history.slice(0, 5))
const popularRows = computed(() => {
  const seen = new Set(recent.value.map(h => h.text.toLowerCase()))
  return search.popular.filter(p => !seen.has(p.text.toLowerCase()))
})

/** Пока подсказки по набранному тексту грузятся, остаётся прежний список, а не пустота или скелетон */
const lastList = shallowRef<typeof search.suggestions>([])
watch(() => search.suggestions, (v) => { if (v.length) lastList.value = v }, { immediate: true })
// до ответа (в том числе пока идёт дебаунс и статус ещё idle) панель не пустая
const loadingWithList = computed(() => (search.status === 'loading' || search.status === 'idle') && !search.suggestions.length)

const rows = () => Array.from(root.value?.querySelectorAll<HTMLElement>('.srow, .hrow') ?? [])
function focusFirst() { rows()[0]?.focus() }
defineExpose({ focusFirst })

function onKey(e: KeyboardEvent) {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
  const items = rows()
  if (!items.length) return
  e.preventDefault()
  const i = items.indexOf(document.activeElement as HTMLElement)
  items[e.key === 'ArrowDown' ? Math.min(i + 1, items.length - 1) : Math.max(i - 1, 0)]?.focus()
}
</script>

<template>
  <div ref="root" class="ssug" @keydown="onKey">
    <template v-if="showHistory">
      <!-- история (если есть) сверху, популярные запросы показываются всегда: панель никогда не бывает пустой -->
      <section v-if="recent.length" class="ssug__group">
        <header class="ssug__head">
          <h3 class="ssug__title">{{ tr('Недавние запросы') }}</h3>
          <KTextButton size="sm" @click="search.clearHistory()">{{ tr('Очистить') }}</KTextButton>
        </header>
        <ul class="ssug__list" :aria-label="tr('Недавние запросы')">
          <li v-for="h in recent" :key="h.id">
            <HistoryRow :text="h.text" :category-title="h.categoryTitle" @select="emit('pick', h.text, h.categoryTitle)" />
          </li>
        </ul>
      </section>
      <section v-if="popularRows.length" class="ssug__group">
        <h3 v-if="recent.length" class="ssug__title">{{ tr('Популярные запросы') }}</h3>
        <ul class="ssug__list" :aria-label="tr('Популярные запросы')">
          <li v-for="s in popularRows" :key="s.id">
            <SuggestionRow :text="s.text" :category-title="s.categoryTitle" @select="emit('pick', s.text, s.categoryTitle)" />
          </li>
        </ul>
      </section>
    </template>

    <template v-else>
      <p v-if="search.status === 'error'" class="ssug__note" role="alert">
        {{ tr('Не удалось загрузить подсказки.') }}
        <KTextButton size="sm" @click="search.suggest(query)">{{ tr('Повторить') }}</KTextButton>
      </p>
      <ul v-else-if="search.suggestions.length" class="ssug__list" :aria-label="tr('Подсказки')">
        <li v-for="s in search.suggestions" :key="s.id">
          <SuggestionRow :text="s.text" :category-title="s.categoryTitle" :query="trimmed" @select="emit('pick', s.text, s.categoryTitle)" />
        </li>
      </ul>
      <ul v-else-if="loadingWithList" class="ssug__list ssug__list--busy" aria-busy="true" :aria-label="tr('Загрузка подсказок')">
        <template v-if="lastList.length">
          <li v-for="s in lastList" :key="s.id">
            <SuggestionRow :text="s.text" :category-title="s.categoryTitle" @select="emit('pick', s.text, s.categoryTitle)" />
          </li>
        </template>
        <template v-else>
          <li v-for="h in recent" :key="h.id">
            <HistoryRow :text="h.text" :category-title="h.categoryTitle" @select="emit('pick', h.text, h.categoryTitle)" />
          </li>
          <li v-for="s in popularRows" :key="s.id">
            <SuggestionRow :text="s.text" :category-title="s.categoryTitle" @select="emit('pick', s.text, s.categoryTitle)" />
          </li>
        </template>
      </ul>
      <p v-else-if="search.status === 'success'" class="ssug__note">
        {{ tr('Подсказок нет. Нажмите «Найти», чтобы искать «') }}{{ trimmed }}».
      </p>
    </template>
  </div>
</template>

<style scoped>
.ssug__group + .ssug__group { margin-top: 8px; }
.ssug__head { display: flex; align-items: center; justify-content: space-between; }
.ssug__title { margin: 8px 12px 4px; color: var(--color-label-secondary); font-size: var(--text-12-16); line-height: var(--leading-12-16); font-weight: var(--font-weight-medium); text-transform: uppercase; letter-spacing: 0.04em; }
.ssug__head .ssug__title { margin-block: 8px 4px; }
.ssug__list { margin: 0; padding: 0; list-style: none; }
.ssug__list--busy { opacity: 0.6; transition: opacity 0.15s ease-out; }
.ssug__note { margin: 0; padding: 24px 0; color: var(--color-label-secondary); font-size: var(--text-16-20); line-height: var(--leading-16-20); text-align: center; }
.ssug__skeleton { display: flex; flex-direction: column; gap: 12px; padding: 8px 0; }
.ssug__bone { height: 36px; border-radius: var(--radius-md); background: var(--color-fill-gray-3); animation: ssug-pulse 1.2s ease-in-out infinite; }
@keyframes ssug-pulse { 50% { opacity: 0.5; } }
@media (prefers-reduced-motion: reduce) { .ssug__bone { animation: none; } }
</style>
