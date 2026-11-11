<script setup lang="ts">
defineProps<{
  items: string[]
  /** Доступное имя списка */
  label?: string
}>()
</script>

<template>
  <ul v-if="items.length" class="pchips" :aria-label="label ?? tr('Параметры')">
    <li v-for="(t, i) in items" :key="t + i" class="pchips__item" :class="`pchips__item--${i % 3}`">
      <Icon name="kango:check-16" size="16" class="pchips__icon" />{{ tr(t) }}
    </li>
  </ul>
</template>

<style scoped>
.pchips { display: flex; flex-wrap: wrap; gap: 10px; margin: 0; padding: 0; list-style: none; }
.pchips__item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px 9px 12px;
  border-radius: var(--radius-pill);
  background: #fdeee2;
  color: var(--color-label-primary);
  font-size: var(--text-15-16);
  line-height: var(--leading-15-16);
  font-weight: var(--font-weight-medium);
}
.pchips__icon { flex: none; color: var(--color-fill-primary); }
.pchips__item--1 { background: #dff2ee; }
.pchips__item--1 .pchips__icon { color: var(--color-fill-color-3); }
.pchips__item--2 { background: #ece9f8; }
.pchips__item--2 .pchips__icon { color: #5b4bd6; }
</style>
