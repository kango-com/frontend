<script setup lang="ts">
const props = defineProps<{
  to?: string
  selected?: boolean
}>()

const tag = computed(() => (props.to ? resolveComponent('NuxtLink') : 'button'))
const attrs = computed(() => (props.to ? { to: props.to } : { type: 'button' }))
</script>

<template>
  <component
    :is="tag"
    v-bind="attrs"
    class="ktab"
    :class="{ 'ktab--selected': selected }"
    :aria-current="to && selected ? 'page' : undefined"
    :aria-pressed="!to ? !!selected : undefined"
  >
    <span class="ktab__icon"><slot name="icon" /></span>
    <span class="ktab__label"><slot /></span>
  </component>
</template>

<style scoped>
.ktab {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  min-width: 63px;
  height: 44px;
  padding: 3px 14px;
  border: 0;
  border-radius: var(--radius-tab);
  background: transparent;
  color: var(--color-fill-gray);
  font-family: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.15s ease-out;
}
.ktab__icon { display: inline-flex; width: 24px; height: 24px; }
.ktab__label {
  color: var(--color-label-secondary);
  font-size: var(--text-10-12);
  line-height: var(--leading-10-12);
  transition: color 0.15s ease-out;
}
.ktab--selected,
.ktab--selected .ktab__label { color: var(--color-fill-color-4); }
.ktab--selected .ktab__label { font-weight: var(--font-weight-medium); }
.ktab:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
@media (hover: hover) {
  .ktab:hover,
  .ktab:hover .ktab__label { color: var(--color-fill-color-4); }
}
</style>
