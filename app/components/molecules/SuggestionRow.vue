<script setup lang="ts">
import { highlightParts } from '~/utils/search'

const props = defineProps<{
  text: string
  categoryTitle?: string
  /** Введённый запрос: совпавшая часть выделяется */
  query?: string
}>()

defineEmits<{ select: [] }>()

const parts = computed(() => highlightParts(tr(props.text), props.query ?? ''))
</script>

<template>
  <button type="button" class="srow" @click="$emit('select')">
    <!-- подсказка с категорией: значок категории, обычная: лупа (как в макете) -->
    <Icon :name="categoryTitle ? 'kango:device-copy-20' : 'kango:search-20'" size="20" class="srow__icon" />
    <span class="srow__text">
      <span class="srow__title">
        <template v-for="(p, i) in parts" :key="i"><b v-if="p.match">{{ p.text }}</b><template v-else>{{ p.text }}</template></template>
      </span>
      <span v-if="categoryTitle" class="srow__cat">{{ tr(categoryTitle) }}</span>
    </span>
    <Icon name="kango:chevron-right-20" size="20" class="srow__chevron" />
  </button>
</template>

<style scoped>
.srow {
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
.srow:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: -2px; border-radius: var(--radius-md); }
.srow__icon { flex: none; color: var(--color-fill-gray); }
.srow__text { display: flex; flex: 1; flex-direction: column; gap: 1px; min-width: 0; }
.srow__title { font-size: var(--text-15-16); line-height: var(--leading-15-16); overflow-wrap: anywhere; }
.srow__title b { font-weight: var(--font-weight-medium); }
.srow__cat { color: var(--color-label-gray); font-size: var(--text-10-12); line-height: var(--leading-10-12); }
.srow__chevron { flex: none; color: var(--color-fill-gray); }
@media (hover: hover) {
  .srow:hover .srow__title { color: var(--color-fill-color-4); }
}
</style>
