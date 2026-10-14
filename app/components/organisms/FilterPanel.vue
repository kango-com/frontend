<script setup lang="ts">
import type { City, FilterState, RefItem, Section, SortKey } from '~/types'
import { FILTER_SCHEMA, SECTION_OPTIONS, applyLabel, type FieldDef, type SelectField } from '~/utils/filter-schema'
import { SORT_LABELS, defaultValue, filterToQuery, sortsFor } from '~/utils/filters'
import { formatAdsCount } from '~/utils/format'

/**
 * Панель фильтров: на 375 во весь экран, от 768 боковая панель. Поля описаны схемой (utils/filter-schema).
 * Значения правятся прямо в сторе `filters`, закрытие без «Показать» возвращает прежние.
 */
const ui = useUiStore()
const store = useFiltersStore()
const city = useCityStore()
const route = useRoute()
const router = useRouter()

const open = computed({
  get: () => ui.isOpen('filters'),
  set: (v) => { if (v) ui.open('filters'); else ui.close('filters') }
})

const section = ref<Section>('work')
const filter = computed(() => store.state[section.value] as FilterState)
const record = computed(() => filter.value as unknown as Record<string, unknown>)
const fields = computed(() => FILTER_SCHEMA[section.value].filter(f => !f.visible || f.visible(filter.value)))
const q = computed(() => (typeof route.query.q === 'string' ? route.query.q.trim() : ''))

type View = { kind: 'cities' } | { kind: 'select', field: SelectField }
const view = ref<View | null>(null)
/** Выбор в открытом пикере, применяется кнопкой «Применить» */
const pending = ref<string[]>([])

let snapshot: Partial<Record<Section, string>> = {}
let applied = false

watch(open, (v) => {
  if (v) {
    const current = ['work', 'realty', 'goods', 'services'].find(s => route.path === `/${s}`) as Section | undefined
    if (current) section.value = current
    view.value = null
    applied = false
    snapshot = Object.fromEntries((Object.keys(store.state) as Section[]).map(s => [s, JSON.stringify(store.state[s])]))
    store.loadCount(section.value, q.value || undefined)
  } else if (!applied) {
    for (const [s, json] of Object.entries(snapshot)) store.replace(s as Section, JSON.parse(json as string) as FilterState)
  }
})

// счётчик результатов обновляется по мере выбора, с дебаунсом
let timer: ReturnType<typeof setTimeout> | undefined
watch(() => JSON.stringify(filter.value), () => {
  if (!open.value) return
  clearTimeout(timer)
  timer = setTimeout(() => store.loadCount(section.value, q.value || undefined), 250)
})
onBeforeUnmount(() => clearTimeout(timer))

function setValue(key: string, value: unknown, resets?: string[]) {
  const rec = store.state[section.value] as unknown as Record<string, unknown>
  rec[key] = value
  for (const k of resets ?? []) rec[k] = defaultValue(section.value, k)
}

function switchSection(next: string) {
  const to = next as Section
  store.setCities(to, [...filter.value.cityIds])
  section.value = to
  store.loadCount(to, q.value || undefined)
}

// Пикеры: города и значения справочников
const popular = computed(() => city.popular.map(c => c.id))
const cityItems = computed(() => {
  const rest = city.results.filter(c => !popular.value.includes(c.id))
  return [...city.popular, ...rest].map(c => ({ id: c.id, title: c.name }))
})
const cityNames = computed(() => filter.value.cityIds.map(id => ({ id, label: store.labels[id] ?? city.results.find(c => c.id === id)?.name ?? city.popular.find(c => c.id === id)?.name ?? id })))

async function openCities() {
  pending.value = [...filter.value.cityIds]
  view.value = { kind: 'cities' }
  await Promise.all([city.loadPopular(), city.search('')])
}
function applyCities(ids: string[]) {
  const all: City[] = [...city.popular, ...city.results]
  store.remember(all.filter(c => ids.includes(c.id)).map(c => ({ id: c.id, title: c.name })))
  store.setCities(section.value, ids)
  view.value = null
}
let cityTimer: ReturnType<typeof setTimeout> | undefined
const searchCities = (qq: string) => { clearTimeout(cityTimer); cityTimer = setTimeout(() => city.search(qq), 200) }

const source = (f: SelectField) => f.ref(filter.value)
async function openSelect(f: SelectField) {
  const src = source(f)
  if (!src) return
  pending.value = selectIds(f)
  view.value = { kind: 'select', field: f }
  await store.loadRef(src.key, src.load)
}
const selectItems = computed<RefItem[]>(() => {
  const v = view.value
  if (v?.kind !== 'select') return []
  const src = source(v.field)
  return src ? store.refs[src.key] ?? [] : []
})
const selectStatus = computed(() => {
  const v = view.value
  const src = v?.kind === 'select' ? source(v.field) : null
  return src ? store.refStatus[src.key] ?? 'idle' : 'idle'
})
function applyPicker() {
  const v = view.value
  if (!v) return
  if (v.kind === 'cities') { applyCities(pending.value); return }
  const ids = pending.value
  const f = v.field
  setValue(f.key, f.multiple ? ids : (ids[0] ?? defaultValue(section.value, f.key)), f.resets)
  view.value = null
}

function selectIds(f: SelectField): string[] {
  const val = record.value[f.key]
  return Array.isArray(val) ? val as string[] : val ? [String(val)] : []
}
const labelOf = (id: string) => store.labels[id] ?? id
function selectValueText(f: SelectField): string {
  const ids = selectIds(f)
  if (!ids.length) return f.anyLabel
  return f.multiple ? `Выбрано: ${ids.length}` : labelOf(ids[0]!)
}
// зависимое поле неактивно, пока не выбрано то, от чего оно зависит
const loadedFor = (f: SelectField) => {
  const src = source(f)
  if (src && !store.refs[src.key] && !store.refStatus[src.key]) store.loadRef(src.key, src.load)
}
watch(fields, (list) => { if (open.value) list.forEach(f => f.type === 'select' && f.multiple && selectIds(f).length && loadedFor(f)) }, { immediate: true })

const sorts = computed(() => sortsFor(section.value).map(k => ({ value: k, label: SORT_LABELS[k] })))
const sortValue = computed({
  get: () => filter.value.sort,
  set: (v) => { store.state[section.value].sort = (v as SortKey | undefined) ?? 'default' }
})

const count = computed(() => store.counts[section.value])
const buttonText = computed(() => applyLabel(count.value, formatAdsCount))

function reset() {
  store.reset(section.value)
  store.loadCount(section.value, q.value || undefined)
}

function apply() {
  applied = true
  const query: Record<string, string> = { ...filterToQuery(filter.value) }
  if (q.value) query.q = q.value
  open.value = false
  router.push({ path: `/${section.value}`, query })
}

const title = computed(() => (view.value?.kind === 'cities' ? 'Какой город?' : view.value?.kind === 'select' ? view.value.field.label : 'Фильтры'))

function fieldKey(f: FieldDef) {
  return f.type === 'range' ? f.fromKey : f.key
}
</script>

<template>
  <KModalSheet
    v-model="open"
    fullscreen
    :title="title"
    :action="view ? undefined : 'Сбросить'"
    :back="!!view"
    @action="reset"
    @back="view = null"
  >
    <template v-if="view?.kind === 'cities'">
      <PickerView
        :items="cityItems"
        :model-value="pending"
        multiple
        any-label="Весь Израиль"
        search-placeholder="Поиск города"
        :status="city.searching ? 'loading' : 'success'"
        remote
        @search="searchCities"
        @update:model-value="pending = $event"
      />
    </template>

    <template v-else-if="view?.kind === 'select'">
      <PickerView
        :key="view.field.key"
        :items="selectItems"
        :model-value="pending"
        :multiple="view.field.multiple"
        :any-label="view.field.anyLabel"
        :search-placeholder="view.field.searchPlaceholder"
        :status="selectStatus"
        @update:model-value="pending = $event"
      />
    </template>

    <div v-else class="fp">
      <KSegmentControl :model-value="section" :options="SECTION_OPTIONS" label="Раздел" @update:model-value="switchSection" />

      <div class="fp__field">
        <FilterRow label="Где искать" :value="filter.cityIds.length ? `Выбрано: ${filter.cityIds.length}` : 'Весь Израиль'" @click="openCities" />
        <ChipsSummary :items="cityNames" @remove="id => store.setCities(section, filter.cityIds.filter(c => c !== id))" />
      </div>

      <div v-for="f in fields" :key="fieldKey(f)" class="fp__field">
        <template v-if="f.type === 'select'">
          <FilterRow :label="f.label" :value="selectValueText(f)" :placeholder="f.placeholder" :disabled="!source(f)" @click="openSelect(f)" />
          <ChipsSummary
            v-if="f.multiple"
            :items="selectIds(f).map(id => ({ id, label: labelOf(id) }))"
            @remove="id => setValue(f.key, selectIds(f).filter(x => x !== id))"
          />
        </template>
        <ToggleGroup
          v-else-if="f.type === 'options'"
          :label="f.label"
          :options="f.options"
          :multiple="f.multiple"
          :model-value="record[f.key] as string | string[] | undefined"
          @update:model-value="setValue(f.key, $event ?? defaultValue(section, f.key), f.resets)"
        />
        <RangeFields
          v-else-if="f.type === 'range'"
          :label="f.label"
          :unit="f.unit"
          :from="record[f.fromKey] as number | undefined"
          :to="record[f.toKey] as number | undefined"
          @update:from="setValue(f.fromKey, $event)"
          @update:to="setValue(f.toKey, $event)"
        />
        <div v-else class="fp__switch">
          <span>{{ f.label }}</span>
          <KSwitch :label="f.label" :model-value="!!record[f.key]" @update:model-value="setValue(f.key, $event)" />
        </div>
      </div>

      <ToggleGroup label="Сортировка" :options="sorts" :model-value="sortValue" @update:model-value="sortValue = $event as SortKey" />
    </div>

    <template #footer>
      <KButton v-if="view" block @click="applyPicker">Применить</KButton>
      <KButton v-else block :disabled="count === 0" @click="apply">{{ buttonText }}</KButton>
    </template>
  </KModalSheet>
</template>

<style scoped>
.fp { display: flex; flex-direction: column; gap: 20px; }
.fp__field { display: flex; flex-direction: column; gap: 8px; }
.fp__switch { display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: var(--text-16-20); line-height: var(--leading-16-20); }
</style>
