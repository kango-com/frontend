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
}>()

const query = computed({
  get: () => props.search,
  set: v => emit('update:search', v)
})
</script>

<template>
  <header class="khd" :class="{ 'khd--search': withSearch }">
    <nav class="khd__top" aria-label="Служебная">
      <div class="khd__links">
        <KTextButton to="/about" size="sm">О нас</KTextButton>
        <KTextButton to="/support" size="sm">Поддержка</KTextButton>
      </div>
      <div class="khd__links">
        <KTextButton :to="loggedIn ? '/profile' : '/login'" size="md">
          <template #icon-left><Icon name="kango:user-24" size="24" /></template>
          {{ loggedIn ? 'Профиль' : 'Вход и регистрация' }}
        </KTextButton>
        <KTextButton to="/new" size="md">
          <template #icon-left><Icon name="kango:plus-square-24" size="24" /></template>
          Разместить объявление
        </KTextButton>
      </div>
    </nav>

    <div class="khd__main">
      <KLogo class="khd__logo" to="/" :height="32" />
      <KButton class="khd__cats" variant="outline" @click="emit('categories')">
        <template #icon-left><Icon name="kango:menu-24" size="24" /></template>
        Все категории
      </KButton>
      <div class="khd__search">
        <KSearchField v-model="query" placeholder="Что вы ищете?" @submit="emit('submit', $event)" />
        <KButton class="khd__find" @click="emit('submit', search)">Найти</KButton>
      </div>
      <KIconButton class="khd__filter" type="filter" label="Фильтры" :dot="filterDot" @click="emit('filter')" />
      <KButton class="khd__city" variant="plain" @click="emit('city')">
        <template #icon-left><Icon name="kango:map-pin-16" size="16" /></template>
        {{ city }}
      </KButton>
    </div>
  </header>
</template>

<style scoped>
.khd { background: var(--color-background); }
.khd__top { display: none; }
.khd__main {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  padding: 3px 16px;
}
.khd .khd__logo { grid-column: 1; grid-row: 1; justify-self: start; }
.khd .khd__city { grid-column: 2; grid-row: 1; }
.khd .khd__cats,
.khd .khd__find,
.khd .khd__search,
.khd .khd__filter { display: none; }

/* Мобильная и планшетная шапка со строкой поиска */
.khd.khd--search .khd__main {
  grid-template-columns: minmax(0, 1fr) auto;
  padding-bottom: 11px;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  box-shadow: 0 1px 7px color-mix(in srgb, var(--color-label-primary) 10%, transparent);
}
.khd.khd--search .khd__search { display: block; grid-column: 1; grid-row: 2; }
.khd.khd--search .khd__filter { display: inline-flex; grid-column: 2; grid-row: 2; }
.khd.khd--search .khd__find { display: none; }

/* Брейкпоинт desktop 1380px (media query не принимает переменные) */
@media (min-width: 1380px) {
  .khd__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 32px;
    padding: 12px 50px 0;
  }
  .khd__links { display: flex; align-items: center; gap: 24px; }
  .khd__main,
  .khd.khd--search .khd__main {
    grid-template-columns: auto auto minmax(0, 1fr) auto;
    gap: 12px;
    padding: 20px 50px 0;
    border-radius: 0;
    box-shadow: none;
  }
  .khd .khd__logo :deep(img) { width: auto; height: 41px; }
  .khd .khd__logo { grid-column: 1; grid-row: 1; margin-right: 36px; }
  .khd__links :deep(.ktb--sm) { color: var(--color-label-secondary); }
  .khd .khd__cats { display: inline-flex; grid-column: 2; grid-row: 1; width: 224px; }
  .khd .khd__search,
  .khd.khd--search .khd__search { display: flex; align-items: center; gap: 12px; grid-column: 3; grid-row: 1; }
  .khd .khd__find,
  .khd.khd--search .khd__find { display: inline-flex; flex: none; min-width: 112px; }
  .khd .khd__filter,
  .khd.khd--search .khd__filter { display: none; }
  .khd .khd__city { grid-column: 4; grid-row: 1; }
}
</style>
