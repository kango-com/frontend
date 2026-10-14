<script setup lang="ts">
const { t } = useI18n()

defineProps<{
  modelValue?: string
  placeholder?: string
  /** Красная точка на кнопке фильтра (фильтры применены) */
  filterDot?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'submit': [value: string]
  'filter': []
  'focus': []
}>()
</script>

<template>
  <div class="searchbar">
    <KSearchField
      class="searchbar__field"
      :model-value="modelValue"
      :placeholder="placeholder ?? t('nav.searchPlaceholder')"
      @update:model-value="emit('update:modelValue', $event)"
      @focus="emit('focus')"
      @submit="emit('submit', $event)"
    />
    <KIconButton type="filter" label="Фильтры" :dot="filterDot" @click="emit('filter')" />
  </div>
</template>

<style scoped>
.searchbar { display: flex; align-items: center; gap: 8px; width: 100%; }
.searchbar .searchbar__field { flex: 1; min-width: 0; }
</style>
