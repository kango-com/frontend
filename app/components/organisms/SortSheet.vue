<script setup lang="ts">
import type { Section, SortKey } from '~/types'
import { SORT_LABELS, sortsFor } from '~/utils/filters'

const props = defineProps<{
  section?: Section
  modelValue: SortKey
}>()

const emit = defineEmits<{ 'update:modelValue': [value: SortKey] }>()

const ui = useUiStore()
const open = computed({
  get: () => ui.isOpen('sort'),
  set: (v) => { if (v) ui.open('sort'); else ui.close('sort') }
})

/** Для разделов без выбора («Все объявления» в поиске) набор как у товаров */
const options = computed(() => sortsFor(props.section ?? 'goods'))

function pick(key: SortKey) {
  emit('update:modelValue', key)
  open.value = false
}
</script>

<template>
  <KModalSheet v-model="open" :title="tr('Сначала показывать')" :action="tr('Сбросить')" dialog @action="pick('default')">
    <ul class="sort">
      <li v-for="key in options" :key="key">
        <KTableRow type="select" :label="SORT_LABELS[key]" :selected="key === modelValue" @click="pick(key)" />
      </li>
    </ul>
  </KModalSheet>
</template>

<style scoped>
.sort { margin: 0; padding: 0; list-style: none; }
</style>
