<script setup lang="ts">
/**
 * Слайдер. Число в v-model - одиночное значение (Value),
 * массив [от, до] - диапазон (Range).
 */
const props = withDefaults(defineProps<{
  modelValue: number | [number, number]
  min?: number
  max?: number
  step?: number
  label?: string
  disabled?: boolean
}>(), { min: 0, max: 100, step: 1, label: 'Значение' })

const emit = defineEmits<{ 'update:modelValue': [value: number | [number, number]] }>()

const track = ref<HTMLElement>()
const isRange = computed(() => Array.isArray(props.modelValue))
const values = computed<[number, number]>(() =>
  Array.isArray(props.modelValue) ? props.modelValue : [props.min, props.modelValue]
)

const pct = (v: number) => ((v - props.min) / (props.max - props.min)) * 100
const clamp = (v: number) => Math.min(props.max, Math.max(props.min, v))
const snap = (v: number) => clamp(Math.round((v - props.min) / props.step) * props.step + props.min)

const fillStyle = computed(() => {
  const [from, to] = values.value
  return { left: `${pct(from)}%`, width: `${pct(to) - pct(from)}%` }
})

function commit(index: 0 | 1, v: number) {
  const value = snap(v)
  if (!isRange.value) return emit('update:modelValue', value)
  const [from, to] = values.value
  emit('update:modelValue', index === 0 ? [Math.min(value, to), to] : [from, Math.max(value, from)])
}

function fromPointer(e: PointerEvent) {
  const rect = track.value!.getBoundingClientRect()
  return props.min + ((e.clientX - rect.left) / rect.width) * (props.max - props.min)
}

function startDrag(index: 0 | 1, e: PointerEvent) {
  if (props.disabled) return
  const el = e.currentTarget as HTMLElement
  el.setPointerCapture(e.pointerId)
  const move = (ev: PointerEvent) => commit(index, fromPointer(ev))
  const stop = () => {
    el.removeEventListener('pointermove', move)
    el.removeEventListener('pointerup', stop)
    el.removeEventListener('pointercancel', stop)
  }
  el.addEventListener('pointermove', move)
  el.addEventListener('pointerup', stop)
  el.addEventListener('pointercancel', stop)
}

function onKey(index: 0 | 1, e: KeyboardEvent) {
  const cur = values.value[index]
  const big = props.step * 10
  const map: Record<string, number> = {
    ArrowRight: cur + props.step, ArrowUp: cur + props.step,
    ArrowLeft: cur - props.step, ArrowDown: cur - props.step,
    PageUp: cur + big, PageDown: cur - big,
    Home: props.min, End: props.max
  }
  if (e.key in map) {
    e.preventDefault()
    commit(index, map[e.key]!)
  }
}

function onTrackDown(e: PointerEvent) {
  if (props.disabled || e.target !== track.value) return
  const v = fromPointer(e)
  const [from, to] = values.value
  const index: 0 | 1 = isRange.value && Math.abs(v - from) < Math.abs(v - to) ? 0 : 1
  commit(index, v)
}
</script>

<template>
  <div class="ksl" :class="{ 'ksl--disabled': disabled }">
    <div ref="track" class="ksl__track" @pointerdown="onTrackDown">
      <span class="ksl__fill" :style="fillStyle" />
      <button
        v-for="i in (isRange ? [0, 1] as const : [1] as const)"
        :key="i"
        type="button"
        role="slider"
        class="ksl__thumb"
        :style="{ left: `${pct(values[i])}%` }"
        :aria-label="isRange ? `${label}: ${i === 0 ? 'от' : 'до'}` : label"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="values[i]"
        :disabled="disabled"
        @pointerdown.stop="startDrag(i, $event)"
        @keydown="onKey(i, $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.ksl { width: 100%; padding: 12px 7px; touch-action: none; }
.ksl__track { position: relative; height: 2px; border-radius: 12px; background: var(--color-fill-disabled); }
.ksl__fill { position: absolute; top: 0; bottom: 0; border-radius: 12px; background: var(--color-fill-primary); pointer-events: none; }
.ksl__thumb {
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: var(--color-fill-primary);
  transform: translate(-50%, -50%);
  cursor: grab;
}
.ksl__thumb::after { content: ''; position: absolute; inset: -12px; }
.ksl__thumb:active { cursor: grabbing; }
.ksl__thumb:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 3px; }
.ksl--disabled { opacity: 0.5; }
.ksl--disabled .ksl__thumb { cursor: not-allowed; }
</style>
