<script setup lang="ts">
defineProps<{
  modelValue?: string
  value: string
  name?: string
  disabled?: boolean
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <label class="krd" :class="{ 'krd--disabled': disabled }">
    <input
      class="krd__input"
      type="radio"
      :checked="modelValue === value"
      :name="name"
      :value="value"
      :disabled="disabled"
      @change="$emit('update:modelValue', value)"
    >
    <span class="krd__box" aria-hidden="true" />
    <span v-if="$slots.default" class="krd__label"><slot /></span>
  </label>
</template>

<style scoped>
.krd { position: relative; display: inline-flex; align-items: center; gap: 10px; cursor: pointer; }
.krd--disabled { cursor: not-allowed; opacity: 0.5; }
.krd__input { position: absolute; width: 1px; height: 1px; opacity: 0; }
.krd__box {
  position: relative;
  flex: none;
  width: 20px;
  height: 20px;
  border: var(--border-width-strong) solid var(--color-stroke-gray);
  border-radius: 50%;
  background: var(--color-fill-white);
  transition: border-color 0.15s ease-out;
}
.krd__box::after {
  content: '';
  position: absolute;
  inset: 3.5px;
  border-radius: 50%;
  background: var(--color-fill-primary);
  transform: scale(0);
  transition: transform 0.15s ease-out;
}
.krd__input:checked + .krd__box { border-color: var(--color-stroke-primary); }
.krd__input:checked + .krd__box::after { transform: scale(1); }
.krd__input:focus-visible + .krd__box { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
.krd__label { color: var(--color-label-primary); font-size: var(--text-15-16); line-height: var(--leading-15-16); }
</style>
