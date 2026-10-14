<script setup lang="ts">
import { STRENGTH_LABELS, passwordStrength } from '~/utils/password'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  error?: string
  /** Показать оценку надёжности под полем (регистрация, новый пароль) */
  strength?: boolean
  autocomplete?: string
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()

const level = computed(() => passwordStrength(props.modelValue))
</script>

<template>
  <div class="pwd">
    <KTextField
      type="password"
      :model-value="modelValue"
      :placeholder="placeholder ?? tr('Пароль')"
      :error="error"
      :autocomplete="autocomplete"
      @update:model-value="$emit('update:modelValue', $event)"
    />
    <p v-if="strength && level !== 'empty' && !error" class="pwd__hint" :class="`pwd__hint--${level}`" role="status">{{ tr(STRENGTH_LABELS[level]) }}</p>
  </div>
</template>

<style scoped>
.pwd { display: flex; flex-direction: column; gap: 4px; }
.pwd__hint { margin: 0; font-family: var(--font-sans-tight); font-size: var(--text-12-12); line-height: var(--leading-12-12); }
.pwd__hint--short { color: var(--color-fill-error); }
.pwd__hint--weak { color: var(--color-label-secondary); }
.pwd__hint--strong { color: var(--color-fill-color-4); }
</style>
