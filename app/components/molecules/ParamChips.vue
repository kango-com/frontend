<script setup lang="ts">
defineProps<{
  items: string[]
  /** Доступное имя списка */
  label?: string
}>()
</script>

<template>
  <ul v-if="items.length" class="pchips" :aria-label="label ?? tr('Параметры')">
    <li v-for="(t, i) in items" :key="t + i" class="pchips__item">{{ tr(t) }}</li>
  </ul>
</template>

<style scoped>
.pchips { display: flex; flex-wrap: wrap; gap: 8px; margin: 0; padding: 0; list-style: none; }
.pchips__item {
  padding: 6px 10px;
  border-radius: var(--radius-md);
  background: var(--color-fill-gray-3);
  color: var(--color-label-primary);
  font-size: var(--text-14-16);
  line-height: var(--leading-14-16);
}
</style>
