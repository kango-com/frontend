<script setup lang="ts">
export interface ToggleOption {
  value: string
  label: string
}

const props = defineProps<{
  label: string
  options: ToggleOption[]
  /** Одно значение (строка) или набор (массив) */
  modelValue: string | string[] | undefined
  multiple?: boolean
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string | string[] | undefined] }>()

const id = useId()
const selected = computed(() => (Array.isArray(props.modelValue) ? props.modelValue : props.modelValue ? [props.modelValue] : []))
const isOn = (v: string) => selected.value.includes(v)

function toggle(v: string) {
  if (props.multiple) emit('update:modelValue', isOn(v) ? selected.value.filter(x => x !== v) : [...selected.value, v])
  // для одиночного выбора повторный тап снимает значение
  else emit('update:modelValue', isOn(v) ? undefined : v)
}
</script>

<template>
  <div class="tgl" role="group" :aria-labelledby="id">
    <span :id="id" class="tgl__label">{{ label }}</span>
    <div class="tgl__items">
      <button
        v-for="o in options"
        :key="o.value"
        type="button"
        class="tgl__item"
        :class="{ 'tgl__item--on': isOn(o.value) }"
        :aria-pressed="isOn(o.value)"
        @click="toggle(o.value)"
      >{{ o.label }}</button>
    </div>
  </div>
</template>

<style scoped>
.tgl { display: flex; flex-direction: column; gap: 8px; }
.tgl__label { color: var(--color-label-primary); font-size: var(--text-16-20); line-height: var(--leading-16-20); font-weight: var(--font-weight-medium); }
.tgl__items { display: flex; flex-wrap: wrap; gap: 8px; }
.tgl__item {
  height: 36px;
  padding: 0 12px;
  border: var(--border-width) solid var(--color-stroke-gray);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-label-primary);
  font-family: inherit;
  font-size: var(--text-15-16);
  line-height: var(--leading-15-16);
  cursor: pointer;
}
.tgl__item--on { border-color: var(--color-stroke-primary); background: var(--color-fill-tint); }
.tgl__item:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
@media (hover: hover) { .tgl__item:hover { border-color: var(--color-stroke-primary); } }
</style>
