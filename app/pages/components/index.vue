<script setup lang="ts">
useHead({ title: 'Компоненты - Kango' })

interface Group {
  slug: string
  title: string
  items: string
  task: string
}

// Группы компонентов дизайн-системы. Ссылка появляется, когда рядом лежит
// страница `app/pages/components/<slug>.vue`, пока её нет - группа «в работе».
const groups: Group[] = [
  { slug: 'buttons', title: 'Кнопки', items: 'Primary, Secondary, Outline, Neutral, Plain', task: '0007' },
  { slug: 'icon-button', title: 'Кнопка-иконка', items: 'Arrow, Chevron, Close, Favorites, Filter', task: '0008' },
  { slug: 'text-buttons', title: 'Текстовые кнопки и ссылки', items: 'Text button, Link + icon, Attach file', task: '0009' },
  { slug: 'form-fields', title: 'Поля ввода', items: 'Text field, Search field, Dropdown', task: '0010' },
  { slug: 'selection-controls', title: 'Чекбокс, радио, свитч', items: 'Checkbox, Radio button, Switch', task: '0011' },
  { slug: 'slider-segment', title: 'Слайдер и сегмент-контроль', items: 'Slider Value и Range, Segment Controls', task: '0012' },
  { slug: 'chips-tabs', title: 'Чипы и вкладки', items: 'City chips, Filter Tab, Filtr chips, Tabs', task: '0013' },
  { slug: 'list-rows', title: 'Строки списка и аккордеон', items: 'Table View Row, Accordion', task: '0014' },
  { slug: 'cards', title: 'Карточки', items: 'Category card, Ad Card', task: '0015' },
  { slug: 'header-footer', title: 'Шапка, подвал, логотип', items: 'Header, Footer, Logo', task: '0016' },
  { slug: 'mobile-panels', title: 'Мобильные панели', items: 'Navigation Bar, Tab bar, Action bar, Modal Sheet', task: '0017' },
  { slug: 'badge', title: 'Бейдж-счётчик', items: 'Indicator', task: '0018' },
  { slug: 'calendar', title: 'Календарь', items: 'Calendar, Day, Number', task: '0019' }
]

const ready = new Set(
  Object.keys(import.meta.glob('./*.vue'))
    .map(f => f.split('/').pop()!.replace('.vue', ''))
    .filter(name => name !== 'index')
)

const done = computed(() => groups.filter(g => ready.has(g.slug)).length)
</script>

<template>
  <main class="page">
    <h1>Компоненты</h1>
    <p class="hint">
      Витрина компонентов дизайн-системы Kango. Готово групп: {{ done }} из {{ groups.length }}.
      Токены: <NuxtLink to="/tokens">/tokens</NuxtLink>, иконки: <NuxtLink to="/icons">/icons</NuxtLink>.
    </p>

    <ul class="grid">
      <li v-for="g in groups" :key="g.slug">
        <NuxtLink v-if="ready.has(g.slug)" :to="`/components/${g.slug}`" class="cell">
          <span class="title">{{ g.title }}</span>
          <span class="items">{{ g.items }}</span>
        </NuxtLink>
        <div v-else class="cell cell-pending" aria-disabled="true">
          <span class="title">{{ g.title }}</span>
          <span class="items">{{ g.items }}</span>
          <span class="status">В работе, задача {{ g.task }}</span>
        </div>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 16px;
  color: var(--color-fill-gray);
}
h1 { margin: 0 0 4px; color: var(--color-label-primary); }
.hint { margin: 0 0 24px; }
.hint a { color: var(--color-fill-color-3); }
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
  gap: 4px;
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
.items { font-size: var(--text-14-16); line-height: var(--leading-14-16); }
.status {
  margin-top: 4px;
  color: var(--color-label-gray);
  font-size: var(--text-12-12);
  line-height: var(--leading-12-12);
}
</style>
