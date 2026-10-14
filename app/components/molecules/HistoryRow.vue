<script setup lang="ts">
defineProps<{
  text: string
  categoryTitle?: string
}>()

defineEmits<{ select: [] }>()
</script>

<template>
  <button type="button" class="hrow" @click="$emit('select')">
    <Icon name="kango:history-20" size="20" class="hrow__icon" />
    <span class="hrow__text">
      <span class="hrow__title">{{ text }}</span>
      <span v-if="categoryTitle" class="hrow__cat">{{ categoryTitle }}</span>
    </span>
    <Icon name="kango:chevron-right-20" size="20" class="hrow__chevron" />
  </button>
</template>

<style scoped>
.hrow {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 44px;
  padding: 6px 0;
  border: 0;
  border-bottom: var(--border-width) solid var(--color-separator-gray);
  background: none;
  color: var(--color-label-primary);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
}
.hrow:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: -2px; border-radius: var(--radius-md); }
.hrow__icon, .hrow__chevron { flex: none; color: var(--color-fill-gray); }
.hrow__text { display: flex; flex: 1; flex-direction: column; gap: 1px; min-width: 0; }
.hrow__title { font-size: var(--text-15-16); line-height: var(--leading-15-16); overflow-wrap: anywhere; }
.hrow__cat { color: var(--color-label-gray); font-size: var(--text-10-12); line-height: var(--leading-10-12); }
@media (hover: hover) { .hrow:hover .hrow__title { color: var(--color-fill-color-4); } }
</style>
