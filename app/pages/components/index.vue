<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Компоненты - Kango' })

type Level = 'atom' | 'molecule' | 'organism'

interface Item {
  name: string
  level: Level
}
interface Group {
  slug: string
  title: string
  items: Item[]
}
interface Section {
  level: Level
  title: string
  hint: string
  groups: Group[]
}

const a = (name: string): Item => ({ name, level: 'atom' })
const m = (name: string): Item => ({ name, level: 'molecule' })
const o = (name: string): Item => ({ name, level: 'organism' })

// Группа лежит в секции по высшему уровню своих компонентов. Ссылка появляется,
// когда рядом есть страница `app/pages/components/<slug>.vue`.
const sections: Section[] = [
  {
    level: 'atom',
    title: 'Атомы',
    hint: 'Неделимые элементы интерфейса. Не используют другие компоненты дизайн-системы.',
    groups: [
      { slug: 'buttons', title: 'Кнопки', items: [a('KButton')] },
      { slug: 'icon-button', title: 'Кнопка-иконка', items: [a('KIconButton')] },
      { slug: 'selection-controls', title: 'Чекбокс, радио, свитч', items: [a('KCheckbox'), a('KRadio'), a('KSwitch')] },
      { slug: 'slider-segment', title: 'Слайдер и сегмент-контроль', items: [a('KSlider'), a('KSegmentControl')] },
      { slug: 'chips-tabs', title: 'Чипы и вкладки', items: [a('KCityChip'), a('KFilterTab'), a('KFilterChip'), a('KTab')] },
      { slug: 'badge', title: 'Бейдж-счётчик', items: [a('KBadge')] }
    ]
  },
  {
    level: 'molecule',
    title: 'Молекулы',
    hint: 'Несколько атомов, работающих вместе. Не используют организмы.',
    groups: [
      { slug: 'text-buttons', title: 'Текстовые кнопки и загрузка файла', items: [a('KTextButton'), a('KLinkRow'), m('KAttachFile')] },
      { slug: 'form-fields', title: 'Поля ввода', items: [a('KTextField'), a('KSelect'), m('KSearchField')] },
      { slug: 'list-rows', title: 'Строки списка и аккордеон', items: [m('KTableRow'), m('KAccordion')] },
      { slug: 'cards', title: 'Карточки', items: [m('KCategoryCard'), m('KAdCard')] }
    ]
  },
  {
    level: 'organism',
    title: 'Организмы',
    hint: 'Самостоятельные части интерфейса из молекул и атомов. Из них собираются шаблоны и страницы.',
    groups: [
      { slug: 'header-footer', title: 'Шапка, подвал, логотип', items: [a('KLogo'), o('KHeader'), o('KFooter')] },
      { slug: 'mobile-panels', title: 'Мобильные панели', items: [o('KNavBar'), o('KTabBar'), m('KActionBar'), o('KModalSheet')] },
      { slug: 'calendar', title: 'Календарь', items: [o('KCalendar')] },
      { slug: 'city-selector', title: 'Выбор города', items: [m('CityList'), o('CitySelector')] },
      { slug: 'search-blocks', title: 'Блоки поиска', items: [m('SuggestionRow'), m('HistoryRow'), o('SearchSuggest'), o('SearchPanel')] },
      { slug: 'listing-blocks', title: 'Блоки списков', items: [m('AdRowCard'), m('SortButton'), o('SortSheet'), o('ListingToolbar'), o('ListingPage')] },
      { slug: 'filter-blocks', title: 'Блоки фильтров', items: [m('FilterRow'), m('ChipsSummary'), m('RangeFields'), m('ToggleGroup'), o('PickerView'), o('FilterPanel')] },
      { slug: 'ad-blocks', title: 'Блоки объявления', items: [m('Gallery'), m('ParamChips'), m('ContactBar'), m('AuthorCard'), o('ReportDialog'), o('AdDetails')] },
      { slug: 'publish-blocks', title: 'Блоки подачи', items: [m('FormSection'), m('DescriptionField'), m('AddressField'), m('PromoCard'), o('SectionPicker'), o('PublishField'), o('AdForm'), o('PromotePanel'), o('PublishSuccess')] },
      { slug: 'content-blocks', title: 'Блоки контента', items: [m('ContactInfo'), m('OfficeCard'), o('FeedbackForm'), o('AboutContent'), o('DocumentList'), o('DocumentView')] },
      { slug: 'account-blocks', title: 'Блоки профиля', items: [m('MyAdCard'), o('ProfileView'), o('SavedAds'), o('MapView')] },
      { slug: 'home-blocks', title: 'Блоки главной', items: [m('SearchBar'), m('CityChips'), m('AccountCard'), o('CategoriesMenu'), o('SectionsGrid'), o('AdsFeed'), o('HomeHero'), o('HomeCover'), o('ViewedAds'), o('AppHeader'), o('AppTabBar'), a('KContainer'), a('HeroBackdrop')] }
    ]
  }
]

const ready = new Set(
  Object.keys(import.meta.glob('./*.vue'))
    .map(f => f.split('/').pop()!.replace('.vue', ''))
    .filter(name => name !== 'index')
)

const total = sections.reduce((n, s) => n + s.groups.length, 0)
const done = sections.reduce((n, s) => n + s.groups.filter(g => ready.has(g.slug)).length, 0)
const labels: Record<Level, string> = { atom: 'атом', molecule: 'молекула', organism: 'организм' }
</script>

<template>
  <main class="page">
    <h1>Компоненты</h1>
    <p class="hint">
      Витрина дизайн-системы Kango по атомарной структуре. Страниц с компонентами: {{ done }} из {{ total }}.
      Токены: <NuxtLink to="/tokens">/tokens</NuxtLink>, иконки: <NuxtLink to="/icons">/icons</NuxtLink>.
    </p>

    <section v-for="s in sections" :key="s.level" class="section">
      <h2>{{ s.title }}</h2>
      <p class="level-hint">{{ s.hint }}</p>
      <ul class="grid">
        <li v-for="g in s.groups" :key="g.slug">
          <component :is="ready.has(g.slug) ? 'NuxtLink' : 'div'" :to="ready.has(g.slug) ? `/components/${g.slug}` : undefined" class="cell" :class="{ 'cell-pending': !ready.has(g.slug) }">
            <span class="title">{{ g.title }}</span>
            <span class="items">
              <span v-for="i in g.items" :key="i.name" class="item">
                {{ i.name }}<span class="tag" :class="`tag--${i.level}`">{{ labels[i.level] }}</span>
              </span>
            </span>
          </component>
        </li>
      </ul>
    </section>

    <section class="section">
      <h2>Шаблоны и страницы</h2>
      <p class="level-hint">
        Шаблоны (layouts) и страницы приложения собираются из организмов. Появятся в задачах 0024-0037, ссылки на страницы будут здесь.
      </p>
    </section>
  </main>
</template>

<style scoped>
.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 16px;
  color: var(--color-fill-gray);
}
h1 { margin: 0 0 8px; color: var(--color-label-primary); font-size: 32px; line-height: 40px; }
.hint { margin: 0 0 8px; line-height: 24px; }
.hint a { color: var(--color-fill-color-3); }
.section { margin-top: 32px; }
h2 { margin: 0 0 4px; color: var(--color-label-primary); font-size: var(--text-20-20); line-height: var(--leading-20-20); font-weight: var(--font-weight-medium); }
.level-hint { margin: 0 0 12px; font-size: var(--text-14-16); line-height: 20px; }
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.cell {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  padding: 16px;
  border: var(--border-width) solid var(--color-stroke-gray);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: inherit;
  text-decoration: none;
}
a.cell:hover { border-color: var(--color-stroke-primary); }
a.cell:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
.cell-pending { border-style: dashed; }
.title {
  color: var(--color-label-primary);
  font-size: var(--text-17-20);
  line-height: var(--leading-17-20);
  font-weight: var(--font-weight-medium);
}
.items { display: flex; flex-wrap: wrap; gap: 4px 12px; font-size: var(--text-14-16); line-height: var(--leading-14-16); }
.item { display: inline-flex; align-items: center; gap: 4px; }
.tag {
  padding: 1px 6px;
  border-radius: var(--radius-pill);
  font-size: var(--text-10-12);
  line-height: var(--leading-10-12);
  background: var(--color-fill-gray-3);
  color: var(--color-label-secondary);
}
.tag--molecule { background: var(--color-fill-tint); color: var(--color-fill-color-3); }
.tag--organism { background: color-mix(in srgb, var(--color-fill-primary) 12%, transparent); color: var(--color-fill-color-4); }
</style>
