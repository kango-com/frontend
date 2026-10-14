<script setup lang="ts">
defineProps<{
  label: string
  from?: number
  to?: number
  unit?: string
}>()

const emit = defineEmits<{ 'update:from': [value: number | undefined], 'update:to': [value: number | undefined] }>()

/** Пустая или нечисловая строка превращается в undefined (граница не задана) */
const parse = (v: string) => {
  const n = Number(v.replace(/\s/g, ''))
  return v.trim() === '' || Number.isNaN(n) ? undefined : n
}
const id = useId()
</script>

<template>
  <fieldset class="rng" :aria-labelledby="id">
    <legend :id="id" class="rng__label">{{ label }}<template v-if="unit">, {{ unit }}</template></legend>
    <div class="rng__row">
      <KTextField type="number" inputmode="numeric" placeholder="От" :label="`${label}: от`" :model-value="from === undefined ? '' : String(from)" @update:model-value="emit('update:from', parse($event))" />
      <KTextField type="number" inputmode="numeric" placeholder="До" :label="`${label}: до`" :model-value="to === undefined ? '' : String(to)" @update:model-value="emit('update:to', parse($event))" />
    </div>
  </fieldset>
</template>

<style scoped>
.rng { min-width: 0; margin: 0; padding: 0; border: 0; }
.rng__label { padding: 0; margin-bottom: 8px; color: var(--color-label-primary); font-size: var(--text-16-20); line-height: var(--leading-16-20); font-weight: var(--font-weight-medium); }
.rng__row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
</style>
