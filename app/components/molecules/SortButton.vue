<script setup lang="ts">
defineProps<{
  /** Подпись: «Сортировка» или выбранный вариант */
  label: string
  active?: boolean
}>()

defineEmits<{ click: [] }>()
</script>

<template>
  <button type="button" class="sbtn" :class="{ 'sbtn--active': active }" aria-haspopup="dialog" @click="$emit('click')">
    <Icon name="kango:sort-16" size="16" />
    <span>{{ label }}</span>
  </button>
</template>

<style scoped>
.sbtn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 44px;
  padding: 0 12px;
  border: var(--border-width) solid var(--color-stroke-gray);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-label-primary);
  font-size: var(--text-15-16);
  line-height: var(--leading-15-16);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
}
.sbtn--active { border-color: var(--color-stroke-primary); }
.sbtn:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
@media (hover: hover) { .sbtn:hover { border-color: var(--color-stroke-primary); } }
</style>
