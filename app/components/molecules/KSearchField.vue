<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  label?: string
  disabled?: boolean
}>(), { modelValue: '' })

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'submit': [value: string]
}>()

const input = ref<HTMLInputElement>()
// class и style остаются на корне, остальные атрибуты (required, maxlength, @blur и т.д.) уходят на нативный элемент
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const nativeAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

function clear() {
  emit('update:modelValue', '')
  input.value?.focus()
}
</script>

<template>
  <form class="ksf" :class="[attrs.class, { 'ksf--disabled': disabled }]" :style="attrs.style as any" role="search" @submit.prevent="emit('submit', modelValue)">
    <Icon name="kango:search-24" size="24" class="ksf__icon" />
    <input
      v-bind="nativeAttrs"
      ref="input"
      class="ksf__input"
      type="search"
      enterkeyhint="search"
      :value="modelValue"
      :placeholder="tr(placeholder ?? 'Поиск')"
      :aria-label="tr(label ?? placeholder ?? 'Поиск')"
      :disabled="disabled"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <button v-if="modelValue && !disabled" type="button" class="ksf__clear" :aria-label="tr('Очистить поиск')" @click="clear">
      <Icon name="kango:close-24" size="24" />
    </button>
  </form>
</template>

<style scoped>
.ksf {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 44px;
  padding: 0 10px;
  border: var(--border-width) solid var(--color-stroke-gray);
  border-radius: var(--radius-md);
  background: var(--color-fill-white);
}
.ksf--disabled { background: var(--color-fill-gray-3); }
.ksf--disabled .ksf__input { color: var(--color-label-gray); cursor: not-allowed; }
.ksf:focus-within { border-color: var(--color-stroke-primary); box-shadow: 0 0 0 0.5px var(--color-stroke-primary); }
.ksf__icon { flex: none; color: var(--color-fill-primary); }
.ksf__input {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  caret-color: var(--color-fill-primary);
  color: var(--color-label-primary);
  font-size: var(--text-16-16);
  line-height: var(--leading-16-16);
  appearance: none;
}
.ksf__input::placeholder { color: var(--color-label-secondary); opacity: 1; }
.ksf__input::-webkit-search-cancel-button { display: none; }
.ksf__clear {
  display: inline-flex;
  flex: none;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-fill-gray);
  cursor: pointer;
}
.ksf__clear:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); border-radius: var(--radius-sm); }

/* Брейкпоинт desktop 1380px */
@media (min-width: 1380px) {
  .ksf { height: 52px; }
}
</style>
