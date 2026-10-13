<script setup lang="ts">
defineProps<{
  active?: boolean
}>()
</script>

<template>
  <button type="button" class="kft" :class="{ 'kft--active': active }" :aria-pressed="!!active">
    <span class="kft__img"><slot name="image" /></span>
    <span class="kft__label"><slot /></span>
  </button>
</template>

<style scoped>
.kft {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 6px;
  border: var(--border-width) solid var(--color-stroke-gray);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-label-primary);
  font-family: inherit;
  font-size: var(--text-17-20);
  line-height: var(--leading-17-20);
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.15s ease-out, border-color 0.15s ease-out;
}
.kft__img {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 32px;
  overflow: hidden;
  border-radius: 6px;
  background: var(--color-fill-tint);
}
.kft__img :deep(img) { width: 100%; height: 100%; object-fit: cover; }
.kft--active { border-color: var(--color-stroke-primary); background: color-mix(in srgb, var(--color-fill-primary) 5%, transparent); }
.kft:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
@media (hover: hover) { .kft:not(.kft--active):hover { border-color: var(--color-fill-gray); } }
.kft__label { padding-right: 6px; }
</style>
