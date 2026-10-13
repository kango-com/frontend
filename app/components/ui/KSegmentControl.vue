<script setup lang="ts">
export interface SegmentOption {
  value: string
  label: string
}

const props = defineProps<{
  modelValue?: string
  options: SegmentOption[]
  name?: string
  label?: string
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()

const group = useId()
const selectedIndex = computed(() => props.options.findIndex(o => o.value === props.modelValue))
</script>

<template>
  <div class="ksg" role="radiogroup" :aria-label="label">
    <label
      v-for="(o, i) in options"
      :key="o.value"
      class="ksg__item"
      :class="{
        'ksg__item--selected': o.value === modelValue,
        'ksg__item--sep': i > 0 && i !== selectedIndex && i - 1 !== selectedIndex
      }"
    >
      <input
        class="ksg__input"
        type="radio"
        :name="name ?? group"
        :value="o.value"
        :checked="o.value === modelValue"
        @change="$emit('update:modelValue', o.value)"
      >
      <span class="ksg__text">{{ o.label }}</span>
    </label>
  </div>
</template>

<style scoped>
.ksg {
  display: flex;
  gap: 0;
  width: 100%;
  padding: 2px;
  border-radius: var(--radius-md);
  background: var(--color-fill-gray-3);
}
.ksg__item {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 3px 10px;
  border-radius: 10px;
  color: var(--color-label-primary);
  font-size: var(--text-14-16);
  line-height: var(--leading-14-16);
  cursor: pointer;
  transition: background-color 0.15s ease-out;
}
.ksg__item--selected { background: var(--color-fill-white); font-weight: var(--font-weight-medium); }
.ksg__item--sep::before {
  content: '';
  position: absolute;
  top: 14px;
  left: -1px;
  width: 1px;
  height: 16px;
  background: var(--color-separator-gray);
}
.ksg__input { position: absolute; width: 1px; height: 1px; opacity: 0; }
.ksg__item:has(.ksg__input:focus-visible) { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
.ksg__text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
