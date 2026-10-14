<script setup lang="ts">
type RowType = 'none' | 'select' | 'chevron' | 'checkbox' | 'radio'

const props = withDefaults(defineProps<{
  type?: RowType
  label: string
  description?: string
  /** select: строка выбрана (оранжевая галочка) */
  selected?: boolean
  /** checkbox */
  modelValue?: boolean | string
  /** radio: значение этой строки */
  value?: string
  name?: string
  to?: string
}>(), { type: 'none' })

const emit = defineEmits<{
  'update:modelValue': [value: boolean | string | string[]]
  'click': []
}>()

const interactive = computed(() => !!props.to || props.type === 'select' || props.type === 'chevron')
// статичная строка (type none без ссылки) - не кнопка, чтобы не попадать в Tab без действия
const interactiveTag = computed(() => (props.to ? resolveComponent('NuxtLink') : interactive.value ? 'button' : 'div'))
const interactiveAttrs = computed(() => {
  if (props.to) return { to: props.to }
  if (!interactive.value) return {}
  return { type: 'button', ...(props.type === 'select' ? { 'aria-pressed': !!props.selected } : {}) }
})
</script>

<template>
  <KCheckbox
    v-if="type === 'checkbox'"
    class="ktr"
    :model-value="!!modelValue"
    @update:model-value="emit('update:modelValue', $event as boolean)"
  >
    <span class="ktr__text">
      <span class="ktr__label">{{ tr(label) }}</span>
      <span v-if="description" class="ktr__desc">{{ tr(description) }}</span>
    </span>
  </KCheckbox>

  <KRadio
    v-else-if="type === 'radio'"
    class="ktr"
    :model-value="modelValue as string"
    :value="value ?? label"
    :name="name"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <span class="ktr__text">
      <span class="ktr__label">{{ tr(label) }}</span>
      <span v-if="description" class="ktr__desc">{{ tr(description) }}</span>
    </span>
  </KRadio>

  <component :is="interactiveTag" v-else v-bind="interactiveAttrs" class="ktr ktr--row" @click="emit('click')">
    <span v-if="$slots.icon" class="ktr__icon"><slot name="icon" /></span>
    <span class="ktr__text">
      <span class="ktr__label">{{ tr(label) }}</span>
      <span v-if="description" class="ktr__desc">{{ tr(description) }}</span>
    </span>
    <Icon v-if="type === 'select' && selected" name="kango:check-20" size="20" class="ktr__check" />
    <Icon v-else-if="type === 'chevron'" name="kango:chevron-right-20" size="20" class="ktr__chevron" />
  </component>
</template>

<style scoped>
.ktr,
.kcb.ktr,
.krd.ktr { display: flex; align-items: center; width: 100%; min-height: 44px; gap: 8px; }
.ktr--row {
  padding: 0;
  border: 0;
  background: none;
  color: var(--color-label-primary);
  font-family: inherit;
  text-align: left;
  text-decoration: none;
}
.ktr--row:is(button, a) { cursor: pointer; }
.ktr--row:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; border-radius: var(--radius-sm); }
.ktr__icon { display: inline-flex; flex: none; color: var(--color-fill-gray); }
.ktr__text { display: flex; flex: 1; flex-direction: column; gap: 2px; min-width: 0; }
.ktr__label { color: var(--color-label-primary); font-size: var(--text-15-16); line-height: var(--leading-15-16); }
.ktr__desc { color: var(--color-label-secondary); font-size: var(--text-10-12); line-height: var(--leading-10-12); }
.ktr__check { flex: none; color: var(--color-fill-primary); }
.ktr__chevron { flex: none; color: var(--color-fill-gray); }
</style>
