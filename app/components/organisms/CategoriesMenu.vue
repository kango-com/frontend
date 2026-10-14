<script setup lang="ts">
import { referencesApi } from '~/api'
import type { RefItem, Section } from '~/types'
import { formatAdsCount } from '~/utils/format'

/**
 * Меню «Все категории»: четыре раздела, у каждого раскрывается список категорий.
 * Ссылка на категорию ведёт на страницу раздела с фильтром по ней (`categoryId` или `category` в адресе).
 */
const ui = useUiStore()
const filters = useFiltersStore()
const sections = useSectionsStore()
const { locale } = useI18n()
const route = useRoute()
const city = useCityStore()

const open = computed({
  get: () => ui.isOpen('menu'),
  set: (v) => { if (v) ui.open('menu'); else ui.close('menu') }
})

interface Entry { id: Section, title: string, key: string, param: string, load: () => Promise<RefItem[]> }
const ENTRIES: Entry[] = [
  { id: 'work', title: 'Работа', key: 'work.categories', param: 'categoryId', load: referencesApi.workCategories },
  { id: 'realty', title: 'Недвижимость', key: 'realty.categories', param: 'category', load: referencesApi.realtyCategories },
  { id: 'goods', title: 'Товары', key: 'goods.categories', param: 'categoryId', load: referencesApi.goodsCategories },
  { id: 'services', title: 'Услуги', key: 'services.categories', param: 'categoryId', load: referencesApi.servicesCategories }
]

const expanded = reactive<Record<string, boolean>>({})
function toggle(e: Entry, value: boolean) {
  expanded[e.id] = value
  if (value) filters.loadRef(e.key, e.load)
}

const items = (e: Entry) => filters.refs[e.key] ?? []
const status = (e: Entry) => filters.refStatus[e.key]
const count = (id: Section) => {
  const s = sections.byId(id)
  return s ? formatAdsCount(s.count, locale.value as 'ru' | 'en' | 'he') : undefined
}

// счётчики разделов подгружаем при открытии, если их ещё нет
watch(open, (v) => { if (v && !sections.items.length) sections.load(city.cityIds) })

// переход закрывает меню
watch(() => route.fullPath, () => { open.value = false })
</script>

<template>
  <KModalSheet v-model="open" fullscreen :title="tr('Все категории')">
    <ul class="cmenu">
      <li v-for="e in ENTRIES" :key="e.id">
        <KAccordion :model-value="!!expanded[e.id]" :title="tr(e.title)" @update:model-value="toggle(e, $event)">
          <ul class="cmenu__list">
            <li><KTableRow type="chevron" :label="tr('Все в разделе «{title}»', { title: tr(e.title) })" :description="count(e.id)" :to="`/${e.id}`" /></li>
            <li v-for="c in items(e)" :key="c.id">
              <KTableRow type="chevron" :label="tr(c.title)" :to="`/${e.id}?${e.param}=${encodeURIComponent(c.id)}`" />
            </li>
            <li v-if="status(e) === 'loading' && !items(e).length" class="cmenu__note" aria-busy="true">{{ tr('Загрузка...') }}</li>
            <li v-else-if="status(e) === 'error'" class="cmenu__note" role="alert">
              {{ tr('Не удалось загрузить категории.') }} <KTextButton size="sm" @click="filters.loadRef(e.key, e.load, true)">{{ tr('Повторить') }}</KTextButton>
            </li>
          </ul>
        </KAccordion>
      </li>
    </ul>
  </KModalSheet>
</template>

<style scoped>
.cmenu { margin: 0; padding: 0; list-style: none; }
.cmenu__list { margin: 0; padding: 0 0 8px; list-style: none; }
.cmenu__note { padding: 12px 0; color: var(--color-label-secondary); font-size: var(--text-14-16); }
</style>
