<script setup lang="ts">
import type { City } from '~/types'

defineProps<{
  cities: City[]
  activeId?: string
}>()

defineEmits<{ select: [city: City] }>()
</script>

<template>
  <div class="chips" role="group" aria-label="Города">
    <KCityChip v-for="c in cities" :key="c.id" :active="c.id === activeId" @click="$emit('select', c)">{{ c.name }}</KCityChip>
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
</style>
