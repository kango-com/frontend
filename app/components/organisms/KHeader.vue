<script setup lang="ts">
const props = withDefaults(defineProps<{
  city?: string
  /** Мобильная и планшетная шапка: показать строку поиска с фильтром (на desktop поиск есть всегда) */
  withSearch?: boolean
  search?: string
  loggedIn?: boolean
  /** Показать красную точку на кнопке фильтра */
  filterDot?: boolean
  /** Раскрытый поиск (desktop): поле на всю ширину, «Найти» внутри, подсказки под ним */
  searching?: boolean
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

/** Ширина кнопки города нужна полю поиска: город лежит поверх его правого края, крестик очистки стоит вплотную к нему */
const root = ref<HTMLElement>()
const cityBtn = ref<{ $el: HTMLElement }>()
onMounted(() => {
  const el = cityBtn.value?.$el
  if (!el || typeof ResizeObserver === 'undefined') return
  const ro = new ResizeObserver(() => {
    const w = el.offsetWidth
    // в раскрытом поиске город скрыт (ширина 0): оставляем последнее известное значение
    if (w > 0) root.value?.style.setProperty('--khd-city-w', `${w}px`)
  })
  ro.observe(el)
  onBeforeUnmount(() => ro.disconnect())
})

const query = computed({
  get: () => props.search,
  set: v => emit('update:search', v)
})
</script>

<template>
  <header ref="root" class="khd" :class="{ 'khd--search': withSearch, 'khd--searching': searching }">
    <nav class="khd__top" :aria-label="t('nav.service')">
      <div class="khd__tl">
        <KTextButton to="/about" size="sm">{{ t('nav.about') }}</KTextButton>
        <KTextButton to="/support" size="sm">{{ t('nav.support') }}</KTextButton>
      </div>
      <div class="khd__tl">
        <KTextButton to="/new" size="md">
          <template #icon-left><Icon name="kango:plus-24" size="24" /></template>
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
      <KButton ref="cityBtn" class="khd__city" variant="plain" @click="emit('city')">
        <template #icon-left><Icon name="kango:map-pin-16" size="16" /></template>
        {{ tr(city) }}
      </KButton>
      <nav class="khd__tools" :aria-label="t('nav.service')">
        <NuxtLink to="/favorites" class="khd__tool" :aria-label="t('tabs.favorites')"><Icon name="kango:heart-24" size="24" /></NuxtLink>
        <NuxtLink v-if="loggedIn" to="/messages" class="khd__tool" :aria-label="t('tabs.messages')"><Icon name="kango:message-24" size="24" /></NuxtLink>
        <NuxtLink :to="loggedIn ? '/profile' : '/login'" class="khd__tool khd__tool--user" :aria-label="loggedIn ? t('nav.profile') : t('nav.login')"><Icon name="kango:user-24" size="24" /></NuxtLink>
      </nav>
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

/* Desktop 1380+ (композиция как у крупных досок объявлений): две строки.
   Верхняя: слева «О нас» и «Поддержка», справа «Разместить объявление».
   Основная: логотип, синяя «Все категории», поле поиска с городом внутри, язык, справа избранное, сообщения и профиль. */
.khd__links, .khd__tools { display: none; }
@media (min-width: 1380px) {
  .khd .khd__lang--top { display: none; }
  .khd__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1380px;
    height: 44px;
    margin-inline: auto;
    padding: 16px 50px 0;
  }
  .khd__tl { display: flex; align-items: center; gap: 24px; }
  /* все ссылки верхней строки одного цвета и размера */
  .khd__tl :deep(.ktb--sm),
  .khd__tl :deep(.ktb--md) { color: var(--color-label-primary); font-size: var(--text-15-16); line-height: var(--leading-15-16); }
  .khd__tl :deep(.ktb__icon) { color: var(--color-label-primary); }

  .khd__main,
  .khd.khd--search .khd__main {
    max-width: 1380px;
    margin-inline: auto;
    grid-template-columns: auto auto minmax(0, 1fr) auto auto;
    grid-template-rows: auto;
    gap: 12px;
    /* 44 (верхняя строка) + 10 + 52 + 22 = 128px, как --header-h в layout */
    padding: 10px 50px 22px;
    border-radius: 0;
    box-shadow: none;
  }
  .khd .khd__logo { grid-column: 1; grid-row: 1; margin-right: 24px; }
  .khd .khd__logo :deep(img) { width: auto; height: 41px; }
  .khd .khd__cats { display: inline-flex; grid-column: 2; grid-row: 1; min-width: 176px; height: 52px; white-space: nowrap; }

  /* поле поиска; город лежит внутри него справа */
  .khd .khd__search,
  .khd.khd--search .khd__search { display: contents; }
  .khd .khd__search > :first-child {
    grid-column: 3;
    grid-row: 1;
    height: 52px;
    padding: 0 calc(var(--khd-city-w, 140px) + 16px) 0 16px;
  }
  .khd .khd__city { grid-column: 3; grid-row: 1; justify-self: end; margin-inline: 0 8px; height: 40px; max-width: 180px; z-index: 1; }
  /* вместо «Найти» справа от поля стоит переключатель языка (отправка поиска по Enter) */
  .khd .khd__find,
  .khd.khd--search .khd__find { display: none; }
  .khd .khd__lang--m,
  .khd.khd--search .khd__lang--m { display: block; grid-column: 4; grid-row: 1; }
  /* на desktop фильтры открываются со страниц списков, кнопки в шапке нет */
  .khd .khd__filter,
  .khd.khd--search .khd__filter { display: none; }

  /* Раскрытый поиск: ширина поля не меняется, вместо города внутри поля справа стоит «Найти» */
  .khd.khd--searching .khd__city { display: none; }
  .khd.khd--searching .khd__search > :first-child { padding-right: 124px; }
  .khd.khd--searching .khd__find { display: inline-flex; grid-column: 3; grid-row: 1; justify-self: end; margin-right: 6px; min-width: 104px; height: 40px; z-index: 1; }

  /* в поле поиска шапки крестика очистки нет */
  .khd .khd__search :deep(.ksf__clear) { display: none; }

  .khd .khd__tools { display: flex; grid-column: 5; grid-row: 1; align-items: center; gap: 4px; }
  /* язык, избранное, сообщения и профиль: одинаковые круглые кнопки на белой подложке, один цвет иконок */
  .khd .khd__tool,
  .khd .khd__lang--m :deep(.lang__btn) { display: inline-flex; align-items: center; justify-content: center; height: 44px; border-radius: 22px; background: color-mix(in srgb, var(--color-background) 85%, transparent); color: var(--color-label-primary); text-decoration: none; transition: color 0.15s ease-out, background-color 0.15s ease-out; }
  .khd .khd__tool { width: 44px; }
  .khd .khd__lang--m :deep(.lang__btn) { padding-inline: 12px; }
  .khd .khd__tool:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
  .khd .khd__searchbtn, .khd .khd__links { display: none; }
}
@media (min-width: 1380px) and (hover: hover) {
  .khd .khd__tool:hover { color: var(--color-fill-color-4); background: var(--color-fill-tint); }
}
</style>
