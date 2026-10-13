<script setup lang="ts">
import type { City } from '~/types'

defineProps<{
  cities: City[]
  selectedId?: string
  loading?: boolean
}>()

defineEmits<{ select: [city: City] }>()
</script>

<template>
  <div class="city-list">
    <p v-if="!cities.length && !loading" class="empty">Ничего не найдено. Проверьте название города.</p>
    <ul v-else class="list" role="listbox" aria-label="Города">
      <li v-for="c in cities" :key="c.id" role="option" :aria-selected="c.id === selectedId">
        <KTableRow type="select" :label="c.name" :selected="c.id === selectedId" @click="$emit('select', c)" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.list { margin: 0; padding: 0; list-style: none; }
.empty { margin: 0; padding: 24px 0; color: var(--color-label-secondary); font-size: var(--text-16-20); line-height: var(--leading-16-20); text-align: center; }
</style>
