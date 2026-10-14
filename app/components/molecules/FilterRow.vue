<script setup lang="ts">
defineProps<{
  label: string
  /** Выбранное значение; пусто - показывается placeholder */
  value?: string
  placeholder?: string
  disabled?: boolean
}>()

defineEmits<{ click: [] }>()
</script>

<template>
  <button type="button" class="frow" :disabled="disabled" @click="$emit('click')">
    <span class="frow__text">
      <span class="frow__label">{{ tr(label) }}</span>
      <span class="frow__value" :class="{ 'frow__value--empty': !value }">{{ tr(value || placeholder || '') }}</span>
    </span>
    <Icon name="kango:chevron-right-20" size="20" class="frow__chevron" />
  </button>
</template>

<style scoped>
.frow {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 56px;
  padding: 8px 12px 8px 16px;
  border: var(--border-width) solid var(--color-stroke-gray);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-label-primary);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
}
.frow:disabled { background: var(--color-fill-gray-4); color: var(--color-label-gray); cursor: default; }
.frow:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
.frow__text { display: flex; flex: 1; flex-direction: column; gap: 2px; min-width: 0; }
.frow__label { color: var(--color-label-secondary); font-size: var(--text-12-16); line-height: var(--leading-12-16); }
.frow__value { overflow: hidden; font-size: var(--text-16-20); line-height: var(--leading-16-20); text-overflow: ellipsis; white-space: nowrap; }
.frow__value--empty { color: var(--color-label-gray); }
.frow__chevron { flex: none; color: var(--color-fill-gray); }
@media (hover: hover) { .frow:not(:disabled):hover { border-color: var(--color-stroke-primary); } }
</style>
