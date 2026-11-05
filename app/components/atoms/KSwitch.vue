<script setup lang="ts">
withDefaults(defineProps<{
  modelValue?: boolean
  /** Доступное имя, если видимого текста (слота) нет */
  label?: string
  /** Пояснение под текстом (12/16, серое) */
  description?: string
  disabled?: boolean
  /** Строка настроек: текст в начале, переключатель в конце, на всю ширину */
  row?: boolean
}>(), { row: false })

defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<template>
  <label class="ksw" :class="{ 'ksw--disabled': disabled, 'ksw--row': row }">
    <input
      class="ksw__input"
      type="checkbox"
      role="switch"
      :checked="modelValue"
      :disabled="disabled"
      :aria-label="$slots.default ? undefined : label"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    >
    <span class="ksw__track" aria-hidden="true"><span class="ksw__thumb" /></span>
    <span v-if="$slots.default || description" class="ksw__text">
      <span v-if="$slots.default" class="ksw__label"><slot /></span>
      <span v-if="description" class="ksw__desc">{{ description }}</span>
    </span>
  </label>
</template>

<style scoped>
.ksw { position: relative; display: inline-flex; align-items: center; gap: 10px; cursor: pointer; }
.ksw--disabled { cursor: not-allowed; }
.ksw--disabled .ksw__track { opacity: 0.5; }
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
  inset-inline-start: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-fill-white);
  box-shadow: 0 1px 2px color-mix(in srgb, var(--color-label-primary) 20%, transparent);
  transition: transform 0.2s ease-out;
}
.ksw__input:checked + .ksw__track { background: var(--color-fill-primary); }
.ksw__input:checked + .ksw__track .ksw__thumb { transform: translateX(24px); }
[dir='rtl'] .ksw__input:checked + .ksw__track .ksw__thumb { transform: translateX(-24px); }
.ksw__input:focus-visible + .ksw__track { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
.ksw__text { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.ksw__label { color: var(--color-label-primary); font-size: var(--text-15-16); line-height: var(--leading-15-16); }
.ksw__desc { color: var(--color-label-secondary); font-size: var(--text-13-16); line-height: var(--leading-13-16); }
.ksw--disabled .ksw__label { color: var(--color-label-secondary); }

/* строка настроек */
.ksw--row { display: flex; width: 100%; min-height: 56px; gap: 16px; padding-block: 8px; }
.ksw--row .ksw__track { order: 1; margin-inline-start: auto; }
.ksw--row .ksw__label { font-size: var(--text-16-20); line-height: var(--leading-16-20); }
</style>
