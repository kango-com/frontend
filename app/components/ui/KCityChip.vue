<script setup lang="ts">
defineProps<{
  active?: boolean
}>()
</script>

<template>
  <button type="button" class="kcc" :class="{ 'kcc--active': active }" :aria-pressed="!!active">
    <Icon name="kango:map-pin-12" size="12" class="kcc__icon" />
    <slot />
  </button>
</template>

<style scoped>
.kcc {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 8px;
  border: var(--border-width) solid var(--color-stroke-gray);
  border-radius: var(--radius-pill);
  background: var(--color-background);
  color: var(--color-label-primary);
  font-family: inherit;
  font-size: var(--text-12-16);
  line-height: var(--leading-12-16);
  white-space: nowrap;
  cursor: pointer;
  transition: border-color 0.15s ease-out;
}
.kcc__icon { flex: none; color: var(--color-fill-color); transition: color 0.15s ease-out; }
.kcc--active { border-color: var(--color-stroke-primary); }
.kcc--active .kcc__icon { color: var(--color-fill-primary); }
.kcc:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
@media (hover: hover) { .kcc:not(.kcc--active):hover { border-color: var(--color-fill-gray); } }
</style>
