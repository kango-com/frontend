<script setup lang="ts">
import type { City } from '~/types'

defineProps<{
  cities: City[]
  activeId?: string
}>()

defineEmits<{ select: [city: City] }>()
</script>

<template>
  <div class="chips" role="group" :aria-label="tr('Города')">
    <KCityChip v-for="c in cities" :key="c.id" :active="c.id === activeId" @click="$emit('select', c)">{{ tr(c.name) }}</KCityChip>
  </div>
</template>

<style scoped>
.chips {
  display: flex;
  gap: 8px;
  padding: 2px;
  margin: -2px;
  overflow-x: auto;
  scrollbar-width: none;
}
.chips::-webkit-scrollbar { display: none; }
.chips > * { flex: none; }
/* Чипы крупнее и с воздухом, как в макете (до desktop) */
@media (max-width: 1379px) {
  .chips { gap: 10px; }
  .chips :deep(.kcc) { height: 36px; padding: 0 14px; gap: 6px; font-size: var(--text-15-16); line-height: var(--leading-15-16); }
}
</style>
