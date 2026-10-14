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
/* как в макете: текстовая кнопка с иконкой, без рамки */
.sbtn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 4px;
  border: 0;
  border-radius: var(--radius-md);
  background: none;
  color: var(--color-label-primary);
  font-family: inherit;
  font-size: var(--text-15-16);
  line-height: var(--leading-15-16);
  cursor: pointer;
}
.sbtn--active { color: var(--color-fill-color-4); }
.sbtn:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
@media (hover: hover) { .sbtn:hover { color: var(--color-fill-color-4); } }
</style>
