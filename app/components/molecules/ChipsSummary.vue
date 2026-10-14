<script setup lang="ts">
export interface SummaryChip {
  id: string
  label: string
}

const props = withDefaults(defineProps<{
  items: SummaryChip[]
  /** Сколько чипов видно, пока список свёрнут */
  max?: number
}>(), { max: 3 })

defineEmits<{ remove: [id: string] }>()

const expanded = ref(false)
const visible = computed(() => (expanded.value ? props.items : props.items.slice(0, props.max)))
const hidden = computed(() => Math.max(0, props.items.length - props.max))
</script>

<template>
  <div v-if="items.length" class="csum">
    <KFilterChip v-for="c in visible" :key="c.id" @remove="$emit('remove', c.id)">{{ tr(c.label) }}</KFilterChip>
    <KTextButton v-if="hidden && !expanded" size="sm" @click="expanded = true">{{ tr('Показать еще') }} {{ hidden }}</KTextButton>
    <KTextButton v-else-if="hidden" size="sm" @click="expanded = false">{{ tr('Скрыть') }}</KTextButton>
  </div>
</template>

<style scoped>
.csum { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
</style>
