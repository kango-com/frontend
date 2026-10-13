<script setup lang="ts">
const props = withDefaults(defineProps<{
  count: number
  /** Больше этого значения показывается «max+» */
  max?: number
  /** Подпись для скринридера, например «активных фильтров» */
  label?: string
}>(), { max: 99 })

const text = computed(() => (props.count > props.max ? `${props.max}+` : String(props.count)))
</script>

<template>
  <span class="kbadge" :class="{ 'kbadge--wide': text.length > 1 }" role="status">
    <span aria-hidden="true">{{ text }}</span>
    <span class="kbadge__sr">{{ count }} {{ label }}</span>
  </span>
</template>

<style scoped>
.kbadge {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 4px;
  border-radius: 10px;
  background: var(--color-fill-primary);
  color: var(--color-label-white);
  font-size: var(--text-12-12);
  line-height: var(--leading-12-12);
  font-weight: var(--font-weight-medium);
  font-variant-numeric: tabular-nums;
}
.kbadge__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
</style>
