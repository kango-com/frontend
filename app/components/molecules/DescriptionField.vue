<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string
  max?: number
  error?: string
  generating?: boolean
}>(), { max: 500 })

const emit = defineEmits<{ 'update:modelValue': [value: string], 'generate': [] }>()

const id = useId()
const over = computed(() => props.modelValue.length > props.max)
</script>

<template>
  <div class="dfield">
    <label :for="id" class="dfield__label">{{ tr('Описание') }}</label>
    <textarea
      :id="id"
      class="dfield__text"
      :class="{ 'dfield__text--error': error || over }"
      rows="5"
      :value="modelValue"
      :aria-invalid="!!(error || over)"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <div class="dfield__foot">
      <span class="dfield__count" :class="{ 'dfield__count--over': over }">{{ modelValue.length }}/{{ max }}</span>
      <KTextButton size="sm" :disabled="generating" @click="emit('generate')">{{ generating ? tr('Генерируем...') : tr('Сгенерировать описание') }}</KTextButton>
    </div>
    <p v-if="error" class="dfield__error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.dfield { display: flex; flex-direction: column; gap: 6px; }
.dfield__label { color: var(--color-label-primary); font-size: var(--text-16-20); line-height: var(--leading-16-20); font-weight: var(--font-weight-medium); }
.dfield__text {
  width: 100%;
  padding: 12px 16px;
  border: var(--border-width) solid var(--color-stroke-gray);
  border-radius: var(--radius-md);
  color: var(--color-label-primary);
  font-family: inherit;
  font-size: var(--text-16-20);
  resize: vertical;
}
.dfield__text:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 1px; }
.dfield__text--error { border-color: var(--color-fill-error); }
.dfield__foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.dfield__count { color: var(--color-label-hint); font-family: var(--font-sans-tight); font-size: var(--text-12-12); }
.dfield__count--over { color: var(--color-fill-error); }
.dfield__error { margin: 0; color: var(--color-fill-error); font-size: var(--text-12-16); }
</style>
