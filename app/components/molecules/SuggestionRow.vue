<script setup lang="ts">
import { highlightParts } from '~/utils/search'

const props = defineProps<{
  text: string
  categoryTitle?: string
  /** Введённый запрос: совпавшая часть выделяется */
  query?: string
}>()

defineEmits<{ select: [] }>()

const parts = computed(() => highlightParts(props.text, props.query ?? ''))
</script>

<template>
  <button type="button" class="srow" @click="$emit('select')">
    <Icon name="kango:search-24" size="24" class="srow__icon" />
    <span class="srow__text">
      <span class="srow__title">
        <template v-for="(p, i) in parts" :key="i"><b v-if="p.match">{{ p.text }}</b><template v-else>{{ p.text }}</template></template>
      </span>
      <span v-if="categoryTitle" class="srow__cat">{{ categoryTitle }}</span>
    </span>
  </button>
</template>

<style scoped>
.srow {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 52px;
  padding: 8px 0;
  border: 0;
  background: none;
  color: var(--color-label-primary);
  text-align: left;
  cursor: pointer;
}
.srow:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; border-radius: var(--radius-md); }
.srow__icon { flex: none; color: var(--color-fill-gray); }
.srow__text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.srow__title { font-size: var(--text-16-20); line-height: var(--leading-16-20); overflow-wrap: anywhere; }
.srow__title b { font-weight: var(--font-weight-medium); }
.srow__cat { color: var(--color-label-secondary); font-size: var(--text-12-16); line-height: var(--leading-12-16); }
@media (hover: hover) {
  .srow:hover .srow__title { color: var(--color-fill-color-4); }
}
</style>
