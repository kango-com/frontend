<script setup lang="ts">
import type { PublishField } from '~/utils/publish-schema'
import { getPath } from '~/utils/publish-schema'

/** Одно поле формы подачи по описанию из схемы: список, переключатель, чекбоксы, число, дата */
const props = defineProps<{
  field: PublishField
  params: Record<string, unknown>
  error?: string
}>()

const emit = defineEmits<{ change: [key: string, value: unknown, resets?: string[]] }>()

const filters = useFiltersStore()

const value = computed(() => getPath(props.params, props.field.key))
const asString = computed(() => (value.value === undefined || value.value === null ? '' : String(value.value)))

const source = computed(() => (props.field.kind === 'select' && props.field.ref ? props.field.ref(props.params) : null))
watch(source, (src) => { if (src) filters.loadRef(src.key, src.load) }, { immediate: true })

const selectOptions = computed(() => {
  if (props.field.kind !== 'select') return []
  if (props.field.options) return props.field.options
  return (source.value ? filters.refs[source.value.key] ?? [] : []).map(i => ({ value: i.id, label: i.title }))
})

const set = (v: unknown) => emit('change', props.field.key, v, props.field.resets)

/** Значения «true» и «false» в списках вариантов хранятся булевыми */
const fromOption = (v: string) => (v === 'true' ? true : v === 'false' ? false : v)
const checks = computed(() => (Array.isArray(value.value) ? (value.value as string[]) : []))
</script>

<template>
  <div class="pf">
    <template v-if="field.kind === 'select'">
      <label class="pf__label">{{ field.label }}</label>
      <KSelect :model-value="asString" :options="selectOptions" :label="field.label" :disabled="!!field.ref && !source" :error="!!error" @update:model-value="set($event || undefined)" />
    </template>

    <template v-else-if="field.kind === 'segment'">
      <span class="pf__label">{{ field.label }}</span>
      <KSegmentControl :model-value="asString" :options="field.options" :label="field.label" @update:model-value="set(fromOption($event))" />
    </template>

    <template v-else-if="field.kind === 'checks'">
      <span class="pf__label">{{ field.label }}</span>
      <div class="pf__checks">
        <KCheckbox v-for="o in field.options" :key="o" :model-value="checks" :value="o" @update:model-value="set($event)">{{ o }}</KCheckbox>
      </div>
    </template>

    <template v-else-if="field.kind === 'number'">
      <label class="pf__label">{{ field.label }}<template v-if="field.unit">, {{ field.unit }}</template></label>
      <KTextField type="number" inputmode="numeric" :model-value="asString" :label="field.label" :error="error" @update:model-value="set($event === '' ? undefined : Number($event))" />
    </template>

    <template v-else-if="field.kind === 'date'">
      <label class="pf__label">{{ field.label }}</label>
      <KTextField type="text" placeholder="ГГГГ-ММ-ДД" :model-value="asString" :label="field.label" :error="error" @update:model-value="set($event || undefined)" />
    </template>

    <div v-else class="pf__switch">
      <span>{{ field.label }}</span>
      <KSwitch :label="field.label" :model-value="!!value" @update:model-value="set($event)" />
    </div>

    <p v-if="error && field.kind !== 'number' && field.kind !== 'date'" class="pf__error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.pf { display: flex; flex-direction: column; gap: 8px; }
.pf__label { color: var(--color-label-primary); font-size: var(--text-16-20); line-height: var(--leading-16-20); font-weight: var(--font-weight-medium); }
.pf__checks { display: flex; flex-direction: column; gap: 4px; }
.pf__switch { display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: var(--text-16-20); line-height: var(--leading-16-20); }
.pf__error { margin: 0; color: var(--color-fill-error); font-size: var(--text-12-16); }
</style>
