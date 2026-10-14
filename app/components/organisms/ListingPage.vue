<script setup lang="ts">
import type { AdsQuery, City, Section, SortKey } from '~/types'
import { activeFilterCount, filterFromQuery, sortButtonLabel } from '~/utils/filters'
import { formatAdsCount } from '~/utils/format'

/** Список объявлений: результаты поиска (без section) или страница раздела. Состояние живёт в параметрах URL. */
const props = defineProps<{ section?: Section }>()

const SECTION_TITLES: Record<Section, string> = { work: 'Работа', realty: 'Недвижимость', goods: 'Товары', services: 'Услуги' }
const SEARCH_HINTS: Record<Section, string> = { work: 'Какую работу хотите?', realty: 'Что вы ищете?', goods: 'Что вы ищете?', services: 'Какую услугу ищите?' }

const route = useRoute()
const router = useRouter()
const city = useCityStore()
const ads = useAdsStore()
const ui = useUiStore()
const sortStore = useSortStore()
const filtersStore = useFiltersStore()
const titleId = useId()

const q = computed(() => (typeof route.query.q === 'string' ? route.query.q.trim() : ''))
const filter = computed(() => (props.section ? filterFromQuery(props.section, route.query) : undefined))
const sort = computed<SortKey>(() => (filter.value?.sort ?? (route.query.sort as SortKey | undefined) ?? 'default'))

const query = computed<AdsQuery>(() => ({
  section: props.section,
  q: q.value || undefined,
  cityIds: filter.value?.cityIds.length ? filter.value.cityIds : city.cityIds,
  sort: sort.value,
  filter: filter.value
}))
const queryJson = computed(() => JSON.stringify(query.value))

const feedKey = computed(() => ads.queryKey(query.value))
const feed = computed(() => ads.feed(feedKey.value))

onMounted(() => city.loadPopular())

watch(queryJson, () => {
  sortStore.set(sort.value)
  if (props.section && filter.value) filtersStore.replace(props.section, filter.value)
  ads.loadList(query.value)
}, { immediate: true })

const heading = computed(() => (props.section ? SECTION_TITLES[props.section] : `Все объявления в ${city.current.name}`))
const subtitle = computed(() => {
  if (feed.value.status !== 'success') return ''
  return q.value ? `По запросу «${q.value}»: ${formatAdsCount(feed.value.total)}` : formatAdsCount(feed.value.total)
})
useHead({ title: computed(() => `${q.value && !props.section ? `${q.value} - ` : ''}${heading.value} - Kango`) })

function setQuery(patch: Record<string, string | undefined>) {
  const next: Record<string, string> = {}
  for (const [k, v] of Object.entries({ ...route.query, ...patch })) if (typeof v === 'string' && v !== '') next[k] = v
  router.replace({ query: next })
}

const search = ref(q.value)
watch(q, v => { search.value = v })
const setSort = (key: SortKey) => setQuery({ sort: key === 'default' ? undefined : key })
const selectCity = (c: City) => {
  city.select(c)
  if (filter.value?.cityIds.length) setQuery({ cityIds: undefined })
}

const filterCount = computed(() => (filter.value ? activeFilterCount(filter.value) : 0))

// Переключатели разделов. Работа: режим. Недвижимость: сделка и вид (assumption: «Комнаты» = type room).
const workMode = computed({
  get: () => (filter.value?.section === 'work' ? filter.value.mode : 'seek-job'),
  set: v => setQuery({ mode: v === 'seek-job' ? undefined : v })
})
const deal = computed({
  get: () => (filter.value?.section === 'realty' ? filter.value.deal : 'rent'),
  set: v => setQuery({ deal: v === 'rent' ? undefined : v })
})
const kind = computed({
  get: () => (filter.value?.section === 'realty' && filter.value.type === 'room' ? 'room' : 'apartment'),
  set: v => setQuery({ type: v === 'apartment' ? undefined : v })
})
const dealOptions = [{ value: 'rent', label: 'Снять' }, { value: 'sale', label: 'Купить' }]
const workOptions = [{ value: 'seek-job', label: 'Ищу работу' }, { value: 'seek-employee', label: 'Ищу сотрудника' }]
const kindOptions = computed(() => [{ value: 'apartment', label: deal.value === 'sale' ? 'Новостройки и вторичка' : 'Квартиры' }, { value: 'room', label: 'Комнаты' }])

const layout = computed(() => (props.section === 'work' || props.section === 'services' ? 'list' : 'grid'))
const emptyText = computed(() => (filterCount.value || q.value ? 'Ничего не найдено. Измените запрос или сбросьте фильтры.' : 'Пока нет объявлений. Попробуйте выбрать другой город.'))
</script>

<template>
  <KContainer as="section" class="lp" :aria-labelledby="titleId">
    <header class="lp__head">
      <h1 :id="titleId" class="lp__title">{{ heading }}</h1>
      <p v-if="subtitle" class="lp__count" aria-live="polite">{{ subtitle }}</p>
    </header>

    <KSegmentControl v-if="section === 'work'" v-model="workMode" class="lp__seg" :options="workOptions" label="Режим" />
    <template v-if="section === 'realty'">
      <KSegmentControl v-model="deal" class="lp__seg" :options="dealOptions" label="Тип сделки" />
      <KSegmentControl v-model="kind" class="lp__seg" :options="kindOptions" label="Вид жилья" />
    </template>

    <KSearchField
      v-if="section"
      v-model="search"
      class="lp__search"
      :placeholder="SEARCH_HINTS[section]"
      :label="SEARCH_HINTS[section]"
      @submit="setQuery({ q: $event.trim() || undefined })"
    />

    <ListingToolbar
      :cities="city.chips"
      :active-city-id="city.current.id"
      :sort-label="sortStore.label"
      :sort-active="sort !== 'default'"
      :filters-count="filterCount"
      @city="selectCity"
      @sort="ui.open('sort')"
      @filters="ui.open('filters')"
    />

    <AdsFeed
      :items="feed.items"
      :status="feed.status"
      :has-more="feed.hasMore"
      :error="feed.error"
      :layout="layout"
      :empty-text="emptyText"
      @more="ads.loadMoreList(query)"
      @retry="ads.loadList(query)"
    >
      <template #empty>
        <KButton v-if="filterCount || q || route.query.deal || route.query.type" variant="outline" @click="router.replace({ query: {} })">Сбросить</KButton>
      </template>
    </AdsFeed>

    <SortSheet :section="section" :model-value="sort" @update:model-value="setSort" />
  </KContainer>
</template>

<style scoped>
.lp { display: flex; flex-direction: column; gap: 12px; padding-block: 16px 32px; }
.lp__head { display: flex; flex-direction: column; gap: 4px; }
.lp__title { margin: 0; color: var(--color-label-primary); font-size: var(--text-22-24); line-height: var(--leading-22-24); font-weight: var(--font-weight-medium); }
.lp__count { margin: 0; color: var(--color-label-secondary); font-size: var(--text-14-16); line-height: var(--leading-14-16); }
@media (min-width: 1380px) {
  .lp { gap: 20px; padding-block: 32px 64px; }
  .lp__title { font-size: 28px; line-height: 32px; }
  .lp__seg, .lp__search { max-width: 480px; }
}
</style>
