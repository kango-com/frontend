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
    <p v-if="!cities.length && !loading" class="empty">Ничего не найдено. Проверьте название города.</p>
    <ul v-else class="list" aria-label="Города">
      <li v-for="c in cities" :key="c.id">
        <KTableRow type="select" :label="c.name" :selected="c.id === selectedId" @click="$emit('select', c)" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.list { margin: 0; padding: 0; list-style: none; }
.list li { border-bottom: var(--border-width) solid var(--color-separator-gray); }
.empty { margin: 0; padding: 24px 0; color: var(--color-label-secondary); font-size: var(--text-16-20); line-height: var(--leading-16-20); text-align: center; }
</style>
