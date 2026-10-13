<script setup lang="ts">
const props = withDefaults(defineProps<{
  /** md - 17/20, sm - 14/16 (на 1380px 15/16) */
  size?: 'md' | 'sm'
  underline?: boolean
  to?: string
  href?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  /** Принудительно показать Hover/Selected */
  selected?: boolean
}>(), { size: 'sm', type: 'button' })

const tag = computed(() => {
  if (props.to) return resolveComponent('NuxtLink')
  if (props.href) return 'a'
  return 'button'
})
const attrs = computed(() => {
  if (props.to || props.href) {
    return { ...(props.to ? { to: props.to } : { href: props.href }), 'aria-disabled': props.disabled || undefined, tabindex: props.disabled ? -1 : undefined }
  }
  return { type: props.type, disabled: props.disabled }
})
</script>

<template>
  <component
    :is="tag"
    v-bind="attrs"
    class="ktb"
    :class="[`ktb--${size}`, { 'ktb--underline': underline, 'ktb--selected': selected, 'ktb--disabled': disabled }]"
  >
    <span v-if="$slots['icon-left']" class="ktb__icon"><slot name="icon-left" /></span>
    <span><slot /></span>
    <span v-if="$slots['icon-right']" class="ktb__icon"><slot name="icon-right" /></span>
  </component>
</template>

<style scoped>
.ktb {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--color-label-primary);
  font-family: inherit;
  font-weight: var(--font-weight-regular);
  font-size: var(--text-14-16);
  line-height: var(--leading-14-16);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.15s ease-out;
}
.ktb--md { font-size: var(--text-17-20); line-height: var(--leading-17-20); }
.ktb--underline { text-decoration: underline; text-underline-offset: 2px; }
.ktb:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; border-radius: var(--radius-sm); }
.ktb__icon { display: inline-flex; flex: none; color: var(--color-fill-gray); transition: color 0.15s ease-out; }
.ktb--selected,
.ktb--selected .ktb__icon { color: var(--color-fill-color-4); }
.ktb--disabled { color: var(--color-label-gray); cursor: not-allowed; pointer-events: none; }
.ktb--disabled .ktb__icon { color: var(--color-label-gray); }
.ktb:disabled { color: var(--color-label-gray); cursor: not-allowed; }

@media (hover: hover) {
  .ktb:not(.ktb--disabled):not(:disabled):hover,
  .ktb:not(.ktb--disabled):not(:disabled):hover .ktb__icon { color: var(--color-fill-color-4); }
}
/* Брейкпоинт desktop 1380px */
@media (min-width: 1380px) {
  .ktb--sm { font-size: var(--text-15-16); line-height: var(--leading-15-16); }
}
</style>
