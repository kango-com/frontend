<script setup lang="ts">
defineProps<{
  modelValue?: boolean
  label?: string
  disabled?: boolean
}>()

defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<template>
  <label class="ksw" :class="{ 'ksw--disabled': disabled }">
    <input
      class="ksw__input"
      type="checkbox"
      role="switch"
      :checked="modelValue"
      :disabled="disabled"
      :aria-label="label"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    >
    <span class="ksw__track" aria-hidden="true"><span class="ksw__thumb" /></span>
    <span v-if="$slots.default" class="ksw__label"><slot /></span>
  </label>
</template>

<style scoped>
.ksw { position: relative; display: inline-flex; align-items: center; gap: 10px; cursor: pointer; }
.ksw--disabled { cursor: not-allowed; opacity: 0.5; }
.ksw__input { position: absolute; width: 1px; height: 1px; opacity: 0; }
.ksw__track {
  position: relative;
  flex: none;
  width: 48px;
  height: 24px;
  border-radius: var(--radius-md);
  background: var(--color-fill-disabled);
  transition: background-color 0.2s ease-out;
}
.ksw__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-fill-white);
  transition: transform 0.2s ease-out;
}
.ksw__input:checked + .ksw__track { background: var(--color-fill-primary); }
.ksw__input:checked + .ksw__track .ksw__thumb { transform: translateX(24px); }
.ksw__input:focus-visible + .ksw__track { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
.ksw__label { color: var(--color-label-primary); font-size: var(--text-15-16); line-height: var(--leading-15-16); }
</style>
