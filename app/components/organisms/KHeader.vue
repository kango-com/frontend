<script setup lang="ts">
const props = withDefaults(defineProps<{
  city?: string
  /** Мобильная и планшетная шапка: показать строку поиска с фильтром (на desktop поиск есть всегда) */
  withSearch?: boolean
  search?: string
  loggedIn?: boolean
  /** Показать красную точку на кнопке фильтра */
  filterDot?: boolean
}>(), { city: 'Тель-Авив', search: '' })

const emit = defineEmits<{
  'update:search': [value: string]
  'submit': [value: string]
  'filter': []
  'city': []
  'categories': []
  'search-open': []
}>()

const { t } = useI18n()

const query = computed({
  get: () => props.search,
  set: v => emit('update:search', v)
})
</script>

<template>
  <header class="khd" :class="{ 'khd--search': withSearch }">
    <nav class="khd__top" :aria-label="t('nav.service')">
      <div class="khd__tl">
        <KTextButton to="/about" size="sm">{{ t('nav.about') }}</KTextButton>
        <KTextButton to="/support" size="sm">{{ t('nav.support') }}</KTextButton>
      </div>
      <div class="khd__tl">
        <KTextButton :to="loggedIn ? '/profile' : '/login'" size="md">
          <template #icon-left><Icon name="kango:user-24" size="24" /></template>
          {{ loggedIn ? t('nav.profile') : t('nav.login') }}
        </KTextButton>
        <KTextButton to="/new" size="md">
          <template #icon-left><Icon name="kango:plus-square-24" size="24" /></template>
          {{ t('nav.post') }}
        </KTextButton>
        <LangSwitch class="khd__lang khd__lang--top" />
      </div>
    </nav>

    <div class="khd__main">
      <KLogo class="khd__logo" to="/" :height="32" />
      <KButton class="khd__cats" variant="secondary" @click="emit('categories')">
        <template #icon-left><Icon name="kango:menu-24" size="24" /></template>
        {{ t('nav.categories') }}
      </KButton>
      <div class="khd__search">
        <KSearchField v-model="query" :placeholder="t('nav.searchPlaceholder')" @submit="emit('submit', $event)" />
        <KButton class="khd__find" @click="emit('submit', search)">{{ t('nav.find') }}</KButton>
      </div>
      <KIconButton class="khd__filter" type="filter" :label="t('nav.filters')" :dot="filterDot" @click="emit('filter')" />
      <button type="button" class="khd__searchbtn" :aria-label="t('nav.search')" @click="emit('search-open')">
        <Icon name="kango:search-24" size="24" />
      </button>
      <LangSwitch class="khd__lang khd__lang--m" />
      <KButton class="khd__city" variant="plain" @click="emit('city')">
        <template #icon-left><Icon name="kango:map-pin-16" size="16" /></template>
        {{ city }}
      </KButton>
      <nav class="khd__links" :aria-label="t('nav.service')">
        <KTextButton :to="loggedIn ? '/profile' : '/login'" size="sm">
          <template #icon-left><Icon name="kango:user-16" size="16" /></template>
          {{ loggedIn ? t('nav.profile') : t('nav.login') }}
        </KTextButton>
        <KTextButton to="/new" size="sm">
          <template #icon-left><Icon name="kango:plus-square-16" size="16" /></template>
          {{ t('nav.post') }}
        </KTextButton>
        <LangSwitch class="khd__lang khd__lang--links" />
      </nav>
    </div>
  </header>
</template>

<style scoped>
.khd { background: var(--color-background); }
.khd__top { display: none; }
.khd__main {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 8px;
  padding: 3px 16px;
}
.khd .khd__logo { grid-column: 1; grid-row: 1; justify-self: start; }
.khd .khd__city { grid-column: 2; grid-row: 1; }
/* иконка поиска в верхней панели на мобильном и планшете (когда строки поиска нет) */
.khd .khd__lang--links, .khd .khd__lang--top { display: none; }
.khd .khd__lang--m { grid-column: 4; grid-row: 1; }
.khd.khd--search .khd__lang--m { grid-column: 3; grid-row: 1; }
.khd.khd--search .khd__city { grid-column: 2; }
.khd .khd__searchbtn { display: inline-flex; grid-column: 3; grid-row: 1; align-items: center; justify-content: center; width: 44px; height: 44px; border: 0; border-radius: var(--radius-md); background: none; color: var(--color-label-primary); cursor: pointer; }
.khd .khd__searchbtn:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
.khd.khd--search .khd__searchbtn { display: none; }
.khd .khd__cats,
.khd .khd__find,
.khd .khd__search,
.khd .khd__filter { display: none; }

/* Мобильная и планшетная шапка со строкой поиска */
.khd.khd--search .khd__main {
  grid-template-columns: minmax(0, 1fr) auto auto;
  padding-bottom: 11px;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  box-shadow: 0 1px 7px color-mix(in srgb, var(--color-label-primary) 10%, transparent);
}
.khd.khd--search .khd__search { display: block; grid-column: 1 / 3; grid-row: 2; }
.khd.khd--search .khd__filter { display: inline-flex; grid-column: 3; grid-row: 2; }
.khd.khd--search .khd__find { display: none; }

/* Брейкпоинт desktop 1380px (media query не принимает переменные).
   Одна строка: логотип, белая плашка (категории, поиск, город, «Найти»), справа служебные ссылки.
   Над баннером главной шапка прозрачная, плашка остаётся белой. */
.khd__links { display: none; }
@media (min-width: 1380px) {
  .khd__main,
  .khd.khd--search .khd__main {
    position: relative;
    max-width: 1380px;
    margin-inline: auto;
    grid-template-columns: auto auto minmax(0, 1fr) auto auto auto;
    grid-template-rows: 44px;
    gap: 8px;
    padding: 32px 50px 20px;
    border-radius: 0;
    box-shadow: none;
  }
  /* белая плашка за колонками 2-6 (категории ... «Найти») */
  .khd__main::before,
  .khd.khd--search .khd__main::before {
    content: '';
    grid-column: 2 / 6;
    grid-row: 1;
    align-self: stretch;
    margin: -6px -9px;
    border-radius: 16px;
    background: var(--color-background);
  }
  .khd .khd__logo { grid-column: 1; grid-row: 1; margin-right: 16px; }
  .khd .khd__logo :deep(img) { width: auto; height: 41px; }
  .khd .khd__cats { display: inline-flex; grid-column: 2; grid-row: 1; min-width: 155px; height: 44px; white-space: nowrap; z-index: 1; }
  .khd .khd__search,
  .khd.khd--search .khd__search { display: contents; }
  .khd .khd__search > :first-child { grid-column: 3; grid-row: 1; z-index: 1; }
  /* на desktop фильтры открываются со страниц списков (как в макете главной), кнопки в шапке нет */
  .khd .khd__filter,
  .khd.khd--search .khd__filter { display: none; }
  .khd .khd__city { grid-column: 4; grid-row: 1; margin-inline: 8px; height: 44px; z-index: 1; }
  .khd .khd__find,
  .khd.khd--search .khd__find { display: inline-flex; grid-column: 5; grid-row: 1; min-width: 112px; height: 44px; z-index: 1; }
  .khd .khd__links { display: flex; grid-column: 6; grid-row: 1; align-items: center; gap: 12px; margin-left: 4px; white-space: nowrap; }
  .khd__links :deep(.ktb) { color: var(--color-label-primary); }
}

@media (min-width: 1380px) { .khd .khd__searchbtn, .khd .khd__lang--m { display: none; } .khd .khd__lang--links { display: block; } }

/* Wide 1920px: макет из двух строк (верхняя строка со ссылками, ниже категории, поиск, «Найти», город), без плашки */
@media (min-width: 1920px) {
  .khd .khd__lang--top { display: block; }
  .khd__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1380px;
    height: 32px;
    margin-inline: auto;
    padding: 12px 50px 0;
  }
  .khd__tl { display: flex; align-items: center; gap: 24px; }
  .khd__tl :deep(.ktb--sm) { color: var(--color-label-secondary); }
  .khd__main,
  .khd.khd--search .khd__main {
    grid-template-columns: auto auto minmax(0, 1fr) auto auto;
    grid-template-rows: auto;
    gap: 12px;
    padding: 20px 50px 0;
  }
  .khd__main::before,
  .khd.khd--search .khd__main::before { display: none; }
  .khd .khd__logo { margin-right: 36px; }
  .khd .khd__cats { width: 224px; height: 52px; background: var(--color-background); color: var(--color-label-primary); border: var(--border-width) solid var(--color-fill-color-3); }
  .khd .khd__search,
  .khd.khd--search .khd__search { display: flex; align-items: center; gap: 12px; grid-column: 3; grid-row: 1; }
  .khd .khd__search > :first-child { grid-column: auto; grid-row: auto; }
  .khd .khd__find,
  .khd.khd--search .khd__find { grid-column: auto; flex: none; height: 52px; }
  .khd .khd__filter,
  .khd.khd--search .khd__filter { display: inline-flex; grid-column: 4; grid-row: 1; }
  .khd .khd__city { grid-column: 5; margin-inline: 0; height: auto; }
  .khd .khd__links { display: none; }
}
</style>
