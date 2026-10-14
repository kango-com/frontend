<script setup lang="ts">
import type { City } from '~/types'

defineProps<{
  cities: City[]
  activeCityId?: string
  sortLabel: string
  sortActive?: boolean
  /** Количество применённых фильтров */
  filtersCount?: number
}>()

const emit = defineEmits<{ city: [city: City], sort: [], filters: [] }>()
</script>

<template>
  <div class="ltb">
    <CityChips class="ltb__chips" :cities="cities" :active-id="activeCityId" @select="emit('city', $event)" />
    <div class="ltb__actions">
      <SortButton :label="sortLabel" :active="sortActive" @click="emit('sort')" />
      <KIconButton type="filter" label="Фильтры" :dot="!!filtersCount" @click="emit('filters')" />
    </div>
  </div>
</template>

<style scoped>
.ltb { display: flex; flex-direction: column; gap: 12px; }
.ltb__actions { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
@media (min-width: 768px) {
  .ltb__actions { justify-content: flex-start; }
}
</style>
