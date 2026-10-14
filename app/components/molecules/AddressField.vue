<script setup lang="ts">
defineProps<{
  modelValue: string
  /** Подсказки улиц выбранного города */
  suggestions?: string[]
  error?: string
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()

const listId = useId()
</script>

<template>
  <div class="addr">
    <KTextField
      :model-value="modelValue"
      :placeholder="tr('Адрес (улица, дом)')"
      :label="tr('Адрес')"
      autocomplete="street-address"
      :list="listId"
      :error="error"
      @update:model-value="$emit('update:modelValue', $event)"
    />
    <datalist :id="listId">
      <option v-for="s in suggestions" :key="s" :value="s" />
    </datalist>
  </div>
</template>
