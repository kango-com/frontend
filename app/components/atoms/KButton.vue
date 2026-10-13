<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'outline' | 'neutral' | 'plain'

const props = withDefaults(defineProps<{
  variant?: Variant
  /** Только для plain: md - 17/20, sm - 15/16 */
  size?: 'md' | 'sm'
  to?: string
  href?: string
  type?: 'button' | 'submit' | 'reset'
  block?: boolean
  disabled?: boolean
  /** Принудительно показать состояние Hover/Selected */
  selected?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button'
})

const tag = computed(() => {
  if (props.to && !props.disabled) return resolveComponent('NuxtLink')
  if (props.href || props.to) return 'a'
  return 'button'
})

const attrs = computed(() => {
  if (props.to || props.href) {
    // отключённая ссылка остаётся без адреса, чтобы по ней нельзя было перейти
    return {
      ...(props.disabled ? {} : props.to ? { to: props.to } : { href: props.href }),
      role: props.disabled ? 'link' : undefined,
      'aria-disabled': props.disabled || undefined,
      tabindex: props.disabled ? -1 : undefined
    }
  }
  return { type: props.type, disabled: props.disabled }
})
</script>

<template>
  <component
    :is="tag"
    v-bind="attrs"
    class="kbtn"
    :class="[`kbtn--${variant}`, `kbtn--${size}`, { 'kbtn--block': block, 'kbtn--selected': selected, 'kbtn--disabled': disabled }]"
  >
    <span v-if="$slots['icon-left']" class="kbtn__icon"><slot name="icon-left" /></span>
    <span class="kbtn__label"><slot /></span>
    <span v-if="$slots['icon-right']" class="kbtn__icon"><slot name="icon-right" /></span>
  </component>
</template>

<style scoped>
.kbtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 44px;
  padding: 0 16px;
  border: 0;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-label-primary);
  font-family: inherit;
  font-size: var(--text-15-16);
  line-height: var(--leading-15-16);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.15s ease-out, border-color 0.15s ease-out, color 0.15s ease-out;
}
.kbtn--block { display: flex; width: 100%; }
.kbtn:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
.kbtn__icon { display: inline-flex; flex: none; }

/* Primary */
.kbtn--primary {
  background: var(--color-fill-primary);
  color: var(--color-label-white);
  font-size: var(--text-17-20);
  line-height: var(--leading-17-20);
}
.kbtn--primary.kbtn--selected { background: var(--color-fill-color-4); }
.kbtn--primary.kbtn--disabled { background: var(--color-fill-disabled); color: var(--color-label-disabled); }

/* Secondary */
.kbtn--secondary {
  border: var(--border-width) solid var(--color-stroke-color);
  background: var(--color-fill-color-3);
  color: var(--color-label-white);
}
.kbtn--secondary.kbtn--disabled {
  background: var(--color-fill-color-disabled);
  border-color: var(--color-fill-color-disabled);
  color: var(--color-label-color-disabled);
}

/* Outline */
.kbtn--outline { border: var(--border-width) solid var(--color-stroke-color); }
.kbtn--outline.kbtn--selected { background: var(--color-fill-color-3); color: var(--color-label-white); }
.kbtn--outline.kbtn--disabled { border-color: var(--color-label-color-disabled); color: var(--color-label-color-disabled); }

/* Neutral */
.kbtn--neutral { background: var(--color-fill-gray-3); }
.kbtn--neutral.kbtn--disabled { background: var(--color-fill-gray-4); color: var(--color-label-gray-2); }

/* Plain */
.kbtn--plain {
  font-weight: var(--font-weight-regular);
  font-size: var(--text-17-20);
  line-height: var(--leading-17-20);
}
.kbtn--plain.kbtn--sm {
  padding: 0 8px;
  font-size: var(--text-15-16);
  line-height: var(--leading-15-16);
}
.kbtn--plain .kbtn__icon { color: var(--color-fill-color); }
.kbtn--plain.kbtn--selected { background: var(--color-fill-gray-10); }
.kbtn--plain.kbtn--disabled { color: var(--color-label-gray); }

@media (hover: hover) {
  .kbtn--primary:not(.kbtn--disabled):hover { background: var(--color-fill-color-4); }
  .kbtn--outline:not(.kbtn--disabled):hover { background: var(--color-fill-color-3); color: var(--color-label-white); }
  .kbtn--plain:not(.kbtn--disabled):hover { background: var(--color-fill-gray-10); }
}

.kbtn:disabled,
.kbtn--disabled { cursor: not-allowed; pointer-events: none; }

/* Брейкпоинт desktop 1380px (media query не принимает переменные) */
@media (min-width: 1380px) {
  .kbtn { height: 52px; }
}
</style>
