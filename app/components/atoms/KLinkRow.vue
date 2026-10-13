<script setup lang="ts">
const props = defineProps<{
  to?: string
  href?: string
}>()

const tag = computed(() => (props.to ? resolveComponent('NuxtLink') : props.href ? 'a' : 'button'))
const attrs = computed(() => (props.to ? { to: props.to } : props.href ? { href: props.href } : { type: 'button' }))
</script>

<template>
  <component :is="tag" v-bind="attrs" class="klr">
    <span class="klr__label"><slot /></span>
    <Icon name="kango:chevron-right-24" size="24" class="klr__icon" />
  </component>
</template>

<style scoped>
.klr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  min-height: 44px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--color-label-primary);
  font-family: inherit;
  font-size: var(--text-16-16);
  line-height: var(--leading-16-16);
  text-align: left;
  text-decoration: none;
  cursor: pointer;
}
.klr__icon { flex: none; color: var(--color-fill-gray); }
.klr:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; border-radius: var(--radius-sm); }
</style>
