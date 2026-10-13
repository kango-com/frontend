<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean | string[]
  /** Значение для режима массива (v-model на string[]) */
  value?: string
  name?: string
  disabled?: boolean
}>()

const emit = defineEmits<{ 'update:modelValue': [value: boolean | string[]] }>()

const checked = computed(() => {
  if (Array.isArray(props.modelValue)) return props.value !== undefined && props.modelValue.includes(props.value)
  return !!props.modelValue
})

function onChange(e: Event) {
  const on = (e.target as HTMLInputElement).checked
  if (Array.isArray(props.modelValue) && props.value !== undefined) {
    emit('update:modelValue', on ? [...props.modelValue, props.value] : props.modelValue.filter(v => v !== props.value))
  } else {
    emit('update:modelValue', on)
  }
}
</script>

<template>
  <label class="kcb" :class="{ 'kcb--disabled': disabled }">
    <input class="kcb__input" type="checkbox" :checked="checked" :name="name" :value="value" :disabled="disabled" @change="onChange">
    <span class="kcb__box" aria-hidden="true">
      <Icon name="kango:check-16" size="16" class="kcb__tick" />
    </span>
    <span v-if="$slots.default" class="kcb__label"><slot /></span>
  </label>
</template>

<style scoped>
.kcb { display: inline-flex; align-items: center; gap: 10px; cursor: pointer; }
.kcb--disabled { cursor: not-allowed; opacity: 0.5; }
.kcb__input { position: absolute; width: 1px; height: 1px; opacity: 0; }
.kcb__box {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: var(--border-width-strong) solid var(--color-stroke-gray);
  border-radius: var(--radius-sm);
  background: var(--color-fill-white);
  color: var(--color-label-white);
  transition: background-color 0.15s ease-out, border-color 0.15s ease-out;
}
.kcb__tick { opacity: 0; }
.kcb__input:checked + .kcb__box { background: var(--color-fill-primary); border-color: var(--color-stroke-primary); }
.kcb__input:checked + .kcb__box .kcb__tick { opacity: 1; }
.kcb__input:focus-visible + .kcb__box { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
.kcb__label { font-size: var(--text-15-16); line-height: var(--leading-15-16); }
</style>
