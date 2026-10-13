<script setup lang="ts">
/**
 * Календарь на один день. Значение - строка `YYYY-MM-DD` (или пусто).
 * Локали: ru (неделя с понедельника) и he (неделя с воскресенья, направление справа налево).
 */
const props = withDefaults(defineProps<{
  modelValue?: string
  locale?: 'ru' | 'he'
  /** Первый день недели: 0 - воскресенье, 1 - понедельник. По умолчанию по локали */
  weekStart?: 0 | 1
  /** Минимальная и максимальная доступные даты (YYYY-MM-DD) */
  min?: string
  max?: string
  /** «Сегодня» (YYYY-MM-DD), по умолчанию текущая дата */
  today?: string
}>(), { modelValue: '', locale: 'ru' })

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const id = useId()

const pad = (n: number) => String(n).padStart(2, '0')
const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const ISO = /^\d{4}-\d{2}-\d{2}$/
const fromIso = (s: string) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y!, m! - 1, d!)
}
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
// Сдвиг на месяцы с ограничением дня последним днём месяца (31 янв + 1 месяц = 28/29 фев)
const addMonths = (d: Date, n: number) => {
  const last = new Date(d.getFullYear(), d.getMonth() + n + 1, 0).getDate()
  return new Date(d.getFullYear(), d.getMonth() + n, Math.min(d.getDate(), last))
}
const clampIso = (iso: string) => {
  if (props.min && iso < props.min) return props.min
  if (props.max && iso > props.max) return props.max
  return iso
}

// «Сегодня» определяется на клиенте после монтирования, чтобы SSR и гидрация не расходились
const nowIso = ref('')
onMounted(() => {
  if (!nowIso.value) nowIso.value = toIso(new Date())
  if (!anchored) initView(nowIso.value)
})
const todayIso = computed(() => props.today ?? nowIso.value)
const start = computed<0 | 1>(() => props.weekStart ?? (props.locale === 'he' ? 0 : 1))
const rtl = computed(() => props.locale === 'he')

// Месяц, который показан, и дата с фокусом клавиатуры
const viewYear = ref(2000)
const viewMonth = ref(0)
const focusIso = ref('')
// Есть ли от чего считать месяц сразу (значение или заданное «сегодня»); иначе ждём клиента
const anchorIso = () => (props.modelValue && ISO.test(props.modelValue) ? props.modelValue : props.today && ISO.test(props.today) ? props.today : '')
const anchored = !!anchorIso()
const ready = ref(anchored)

function initView(iso: string) {
  const d = fromIso(clampIso(iso))
  viewYear.value = d.getFullYear()
  viewMonth.value = d.getMonth()
  focusIso.value = toIso(d)
  ready.value = true
}
if (anchored) initView(anchorIso())

watch(() => props.modelValue, (v) => {
  if (v && ISO.test(v)) initView(v)
})

const monthLabel = computed(() => {
  if (!ready.value) return ''
  const text = new Intl.DateTimeFormat(props.locale, { month: 'long', year: 'numeric' }).format(new Date(viewYear.value, viewMonth.value, 1))
  return text.charAt(0).toUpperCase() + text.slice(1)
})

const weekdays = computed(() => {
  // 2024-01-07 воскресенье
  const fmt = new Intl.DateTimeFormat(props.locale, { weekday: props.locale === 'he' ? 'narrow' : 'short' })
  return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2024, 0, 7 + ((i + start.value) % 7))))
})

interface Cell { iso: string; day: number; label: string; disabled: boolean }

const weeks = computed<(Cell | null)[][]>(() => {
  if (!ready.value) return []
  const first = new Date(viewYear.value, viewMonth.value, 1)
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  const offset = (first.getDay() - start.value + 7) % 7
  const cells: (Cell | null)[] = Array.from({ length: offset }, () => null)
  for (let day = 1; day <= daysInMonth; day++) {
    const iso = toIso(new Date(viewYear.value, viewMonth.value, day))
    cells.push({ iso, day, label: new Intl.DateTimeFormat(props.locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(viewYear.value, viewMonth.value, day)), disabled: (!!props.min && iso < props.min) || (!!props.max && iso > props.max) })
  }
  // всегда 6 строк, чтобы высота календаря не менялась при смене месяца
  while (cells.length < 42) cells.push(null)
  return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7))
})

function shiftMonth(delta: number) {
  const d = new Date(viewYear.value, viewMonth.value + delta, 1)
  viewYear.value = d.getFullYear()
  viewMonth.value = d.getMonth()
  focusIso.value = clampIso(toIso(addMonths(fromIso(focusIso.value), delta)))
}

function select(c: Cell) {
  if (c.disabled) return
  focusIso.value = c.iso
  emit('update:modelValue', c.iso)
}

function moveFocus(raw: Date) {
  // фокус остаётся в доступном диапазоне, чтобы клавиатура не застревала на недоступных днях
  const target = fromIso(clampIso(toIso(raw)))
  focusIso.value = toIso(target)
  viewYear.value = target.getFullYear()
  viewMonth.value = target.getMonth()
  nextTick(() => document.getElementById(`${id}-${focusIso.value}`)?.focus())
}

function onKey(e: KeyboardEvent, c: Cell) {
  const d = fromIso(c.iso)
  const dir = rtl.value ? -1 : 1
  const rowStart = (d.getDay() - start.value + 7) % 7
  const map: Record<string, Date> = {
    ArrowRight: addDays(d, dir),
    ArrowLeft: addDays(d, -dir),
    ArrowDown: addDays(d, 7),
    ArrowUp: addDays(d, -7),
    Home: addDays(d, -rowStart),
    End: addDays(d, 6 - rowStart),
    PageUp: addMonths(d, -1),
    PageDown: addMonths(d, 1)
  }
  if (e.key in map) {
    e.preventDefault()
    moveFocus(map[e.key]!)
  }
}

const prevLabel = computed(() => (props.locale === 'he' ? 'החודש הקודם' : 'Предыдущий месяц'))
const nextLabel = computed(() => (props.locale === 'he' ? 'החודש הבא' : 'Следующий месяц'))
</script>

<template>
  <div class="kcal" :dir="rtl ? 'rtl' : 'ltr'" :lang="locale">
    <div class="kcal__head">
      <KIconButton class="kcal__nav" type="chevron-left" :label="prevLabel" @click="shiftMonth(-1)" />
      <span :id="`${id}-title`" class="kcal__title" aria-live="polite">{{ monthLabel }}</span>
      <KIconButton class="kcal__nav" type="chevron-right" :label="nextLabel" @click="shiftMonth(1)" />
    </div>

    <div role="grid" :aria-labelledby="`${id}-title`" class="kcal__grid">
      <div role="row" class="kcal__row kcal__row--names">
        <span v-for="w in weekdays" :key="w" role="columnheader" class="kcal__name">{{ w }}</span>
      </div>
      <div v-for="(week, wi) in weeks" :key="wi" role="row" class="kcal__row">
        <div v-for="(c, ci) in week" :key="ci" role="gridcell" class="kcal__cell" :aria-selected="c ? c.iso === modelValue : undefined">
          <button
            v-if="c"
            :id="`${id}-${c.iso}`"
            type="button"
            class="kcal__day"
            :class="{ 'kcal__day--today': c.iso === todayIso, 'kcal__day--selected': c.iso === modelValue }"
            :disabled="c.disabled"
            :tabindex="c.iso === focusIso ? 0 : -1"
            :aria-label="c.label"
            :aria-current="c.iso === todayIso ? 'date' : undefined"
            @click="select(c)"
            @keydown="onKey($event, c)"
          >
            <span class="kcal__num">{{ c.day }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kcal { width: 100%; max-width: 343px; }
.kcal__head { display: flex; align-items: center; justify-content: space-between; }
.kcal__title {
  color: var(--color-label-primary);
  font-size: var(--text-14-16);
  line-height: var(--leading-14-16);
}
/* Стрелки месяцев зеркалятся в RTL */
.kcal[dir='rtl'] .kcal__nav { transform: scaleX(-1); }

.kcal__grid { display: flex; flex-direction: column; }
.kcal__row { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); }
.kcal__name {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  margin: 12px 0 8px;
  color: var(--color-label-secondary);
  font-size: var(--text-10-12);
  line-height: var(--leading-10-12);
  text-transform: uppercase;
}
.kcal__cell { display: flex; align-items: center; justify-content: center; height: 44px; }
.kcal__day {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-label-primary);
  font-family: inherit;
  font-size: var(--text-14-16);
  line-height: var(--leading-14-16);
  cursor: pointer;
}
.kcal__num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: var(--radius-tab);
  font-variant-numeric: tabular-nums;
  transition: background-color 0.15s ease-out, color 0.15s ease-out;
}
.kcal__day--today .kcal__num { background: var(--color-fill-gray-10); }
.kcal__day--selected .kcal__num { background: var(--color-fill-primary); color: var(--color-label-white); }
.kcal__day:disabled { color: var(--color-label-gray); cursor: not-allowed; }
.kcal__day:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: -2px; border-radius: var(--radius-md); }
/* Hover/Selected в макете один вариант: оранжевая заливка и белая цифра */
@media (hover: hover) {
  .kcal__day:not(:disabled):hover .kcal__num { background: var(--color-fill-primary); color: var(--color-label-white); }
}
</style>
