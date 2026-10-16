<script setup lang="ts">
import type { City } from '~/types'

defineProps<{
  cities: City[]
  selectedId?: string
  loading?: boolean
}>()

defineEmits<{ select: [city: City] }>()

const root = ref<HTMLElement>()
const rows = () => Array.from(root.value?.querySelectorAll<HTMLElement>('button') ?? [])

/** Фокус на первый город (например, стрелкой вниз из поля поиска) */
function focusFirst() { rows()[0]?.focus() }
defineExpose({ focusFirst })

/** Стрелки вверх и вниз переносят фокус по городам, Enter и пробел выбирают (нативная кнопка) */
function onKey(e: KeyboardEvent) {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End') return
  const items = rows()
  if (!items.length) return
  e.preventDefault()
  const i = items.indexOf(document.activeElement as HTMLElement)
  const next = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : e.key === 'ArrowDown' ? Math.min(i + 1, items.length - 1) : Math.max(i - 1, 0)
  items[next]?.focus()
}
</script>

<template>
  <div ref="root" class="city-list" @keydown="onKey">
    <p v-if="!cities.length && !loading" class="empty">{{ tr('Ничего не найдено. Проверьте название города.') }}</p>
    <ul v-else class="list" :aria-label="tr('Города')">
      <li v-for="c in cities" :key="c.id">
        <KTableRow type="select" :label="c.name" :selected="c.id === selectedId" @click="$emit('select', c)" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.list { margin: 0; padding: 0; list-style: none; }
.list { display: flex; flex-direction: column; gap: 2px; }
/* строка: текст и галочка отступают от края подсветки одинаково (12px), подсветка скруглена */
.list li :deep(.ktr--row) { min-height: 44px; padding-inline: 12px; border-radius: var(--radius-md); transition: background-color 0.15s ease-out; }
@media (hover: hover) and (pointer: fine) { .list li :deep(.ktr--row:hover) { background: var(--color-fill-gray-3); } }
.list li :deep(.ktr--row:focus-visible) { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: -2px; }
.empty { margin: 0; padding: 24px 0; color: var(--color-label-secondary); font-size: var(--text-16-20); line-height: var(--leading-16-20); text-align: center; }
</style>
