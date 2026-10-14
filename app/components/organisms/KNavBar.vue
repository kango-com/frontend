<script setup lang="ts">
type NavBarType = 'page' | 'page-title' | 'modal' | 'search' | 'search-filter'

withDefaults(defineProps<{
  type?: NavBarType
  title?: string
  /** modal: текст кнопки справа (например «Сбросить») */
  action?: string
  search?: string
  placeholder?: string
  filterDot?: boolean
}>(), { type: 'page', search: '' })

const emit = defineEmits<{
  'update:search': [value: string]
  'back': []
  'close': []
  'action': []
  'filter': []
  'submit': [value: string]
}>()
</script>

<template>
  <div class="knb" :class="`knb--${type}`">
    <KIconButton v-if="type === 'modal'" type="close" :label="tr('Закрыть')" @click="emit('close')" />
    <KIconButton v-else type="arrow-left" :label="tr('Назад')" @click="emit('back')" />

    <span v-if="type === 'page-title' || type === 'modal'" class="knb__title">{{ title }}</span>

    <KSearchField
      v-if="type === 'search' || type === 'search-filter'"
      class="knb__search"
      :model-value="search"
      :placeholder="tr(placeholder ?? 'Что Вы ищете?')"
      @update:model-value="emit('update:search', $event)"
      @submit="emit('submit', $event)"
    />

    <KIconButton v-if="type === 'search-filter'" type="filter" :label="tr('Фильтры')" :dot="filterDot" @click="emit('filter')" />
    <KTextButton v-if="type === 'modal' && action" size="sm" @click="emit('action')">{{ action }}</KTextButton>
    <span v-else-if="type === 'modal'" class="knb__spacer" />
  </div>
</template>

<style scoped>
.knb {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 50px;
  padding: 3px 16px;
  background: var(--color-background);
}
.knb__title {
  color: var(--color-label-primary);
  font-size: var(--text-17-20);
  line-height: var(--leading-17-20);
  font-weight: var(--font-weight-medium);
}
.knb--page-title .knb__title { margin-left: 4px; }
.knb--modal { justify-content: space-between; }
.knb--modal .knb__title { flex: 1; text-align: center; }
.knb--modal .knb__spacer { width: 44px; }
.knb .knb__search { flex: 1; min-width: 0; }
</style>
