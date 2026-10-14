<script setup lang="ts">
export interface SelectOption {
  value: string
  label: string
}

const props = withDefaults(defineProps<{
  modelValue?: string
  options: SelectOption[]
  placeholder?: string
  label?: string
  disabled?: boolean
  /** Показывать крестик сброса, когда значение выбрано */
  clearable?: boolean
  name?: string
  /** Красная обводка (состояние ошибки) */
  error?: boolean
}>(), { modelValue: '', clearable: false })

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()


// class и style остаются на корне, остальные атрибуты уходят на нативный select
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const nativeAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

const showClear = computed(() => props.clearable && !!props.modelValue && !props.disabled)
</script>

<template>
  <div class="ksel" :class="[attrs.class, { 'ksel--empty': !modelValue, 'ksel--disabled': disabled, 'ksel--error': error }]" :style="attrs.style as any">
    <select
      v-bind="nativeAttrs"
      class="ksel__select"
      :name="name"
      :aria-invalid="error ? true : undefined"
      :value="modelValue"
      :disabled="disabled"
      :aria-label="tr(label ?? placeholder ?? 'Выберите')"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option value="" disabled hidden>{{ tr(placeholder ?? 'Выберите') }}</option>
      <option v-for="o in options" :key="o.value" :value="o.value">{{ tr(o.label) }}</option>
    </select>
    <button v-if="showClear" type="button" class="ksel__clear" :aria-label="tr('Сбросить')" @click="emit('update:modelValue', '')">
      <Icon name="kango:close-24" size="24" />
    </button>
    <Icon v-else name="kango:chevron-down-24" size="24" class="ksel__chevron" />
  </div>
</template>

<style scoped>
.ksel { position: relative; width: 100%; height: 44px; }
.ksel__select {
  width: 100%;
  height: 100%;
  padding: 0 44px 0 16px;
  border: var(--border-width) solid var(--color-stroke-gray);
  border-radius: var(--radius-md);
  background: var(--color-fill-white);
  color: var(--color-label-primary);
  font-size: var(--text-16-16);
  line-height: var(--leading-16-16);
  text-overflow: ellipsis;
  appearance: none;
  cursor: pointer;
}
.ksel--error .ksel__select { border-color: var(--color-fill-error); }
.ksel--empty .ksel__select { color: var(--color-label-secondary); }
.ksel__select:focus-visible { outline: none; border-color: var(--color-stroke-primary); box-shadow: 0 0 0 0.5px var(--color-stroke-primary); }
.ksel--disabled .ksel__select { background: var(--color-fill-gray-3); color: var(--color-label-gray); cursor: not-allowed; }
.ksel__chevron { position: absolute; top: 10px; right: 10px; color: var(--color-fill-gray); pointer-events: none; }
.ksel__clear {
  position: absolute;
  top: 10px;
  right: 10px;
  display: inline-flex;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-fill-gray);
  cursor: pointer;
}
.ksel__clear:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); border-radius: var(--radius-sm); }
</style>
