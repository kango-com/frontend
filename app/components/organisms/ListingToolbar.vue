<script setup lang="ts">
import type { City } from '~/types'

defineProps<{
  cities: City[]
  activeCityId?: string
  sortLabel: string
  sortActive?: boolean
  /** Количество применённых фильтров */
  filtersCount?: number
  /** Результаты поиска: на мобильном только «Сортировка» справа (чипы городов и фильтры в верхней панели) */
  search?: boolean
}>()

const emit = defineEmits<{ city: [city: City], sort: [], filters: [] }>()
</script>

<template>
  <div class="ltb" :class="{ 'ltb--search': search }">
    <CityChips class="ltb__chips" :cities="cities" :active-id="activeCityId" @select="emit('city', $event)" />
    <div class="ltb__actions">
      <SortButton :label="sortLabel" :active="sortActive" @click="emit('sort')" />
      <KIconButton class="ltb__filter" type="filter" label="Фильтры" :dot="!!filtersCount" @click="emit('filters')" />
    </div>
  </div>
</template>

<style scoped>
.ltb { display: flex; flex-direction: column; gap: 12px; }
.ltb__actions { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
@media (min-width: 768px) {
  .ltb__actions { justify-content: flex-start; }
}
@media (max-width: 767px) {
  .ltb--search :deep(.chips),
  .ltb--search .ltb__filter { display: none; }
  .ltb--search .ltb__actions { justify-content: flex-end; }
}
</style>
