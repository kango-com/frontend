<script setup lang="ts">
const props = defineProps<{
  /** Текст в поле поиска: пустой показывает историю, непустой подсказки */
  query: string
}>()

const emit = defineEmits<{ pick: [text: string, categoryTitle?: string] }>()

const search = useSearchStore()
const root = ref<HTMLElement>()
let timer: ReturnType<typeof setTimeout> | undefined

onMounted(() => search.loadHistory())

// дебаунс 200 мс, предыдущий запрос отменяется в сторе
watch(() => props.query, (q) => {
  clearTimeout(timer)
  if (!q.trim()) { search.suggest(''); return }
  timer = setTimeout(() => search.suggest(q), 200)
}, { immediate: true })
onBeforeUnmount(() => { clearTimeout(timer); search.reset() })

const trimmed = computed(() => props.query.trim())
const showHistory = computed(() => !trimmed.value)

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
      <!-- без истории экран пустой (как в макете) -->
      <template v-if="search.history.length">
        <ul class="ssug__list" :aria-label="tr('Недавние запросы')">
          <li v-for="h in search.history" :key="h.id">
            <HistoryRow :text="h.text" :category-title="h.categoryTitle" @select="emit('pick', h.text, h.categoryTitle)" />
          </li>
        </ul>
        <KTextButton class="ssug__clear" size="sm" @click="search.clearHistory()">{{ tr('Очистить историю') }}</KTextButton>
      </template>
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
      <div v-else-if="search.status === 'loading'" class="ssug__skeleton" aria-busy="true" :aria-label="tr('Загрузка подсказок')">
        <span v-for="n in 4" :key="n" class="ssug__bone" />
      </div>
      <p v-else-if="search.status === 'success'" class="ssug__note">
        {{ tr('Подсказок нет. Нажмите «Найти», чтобы искать «') }}{{ trimmed }}».
      </p>
    </template>
  </div>
</template>

<style scoped>
.ssug .ssug__clear { margin-top: 12px; }
.ssug__list { margin: 0; padding: 0; list-style: none; }
.ssug__note { margin: 0; padding: 24px 0; color: var(--color-label-secondary); font-size: var(--text-16-20); line-height: var(--leading-16-20); text-align: center; }
.ssug__skeleton { display: flex; flex-direction: column; gap: 12px; padding: 8px 0; }
.ssug__bone { height: 36px; border-radius: var(--radius-md); background: var(--color-fill-gray-3); animation: ssug-pulse 1.2s ease-in-out infinite; }
@keyframes ssug-pulse { 50% { opacity: 0.5; } }
@media (prefers-reduced-motion: reduce) { .ssug__bone { animation: none; } }
</style>
