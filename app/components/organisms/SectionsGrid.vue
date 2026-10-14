<script setup lang="ts">
import type { Section } from '~/types'
import { formatAdsCount } from '~/utils/format'

const sections = useSectionsStore()
const auth = useAuthStore()

const cards: { id: Section, category: 'work' | 'real-estate' | 'goods' | 'services', title: string }[] = [
  { id: 'work', category: 'work', title: 'Работа' },
  { id: 'realty', category: 'real-estate', title: 'Недвижимость' },
  { id: 'goods', category: 'goods', title: 'Товары' },
  { id: 'services', category: 'services', title: 'Услуги' }
]

const caption = (id: Section) => {
  const s = sections.byId(id)
  return s ? formatAdsCount(s.count) : undefined
}
</script>

<template>
  <ul class="sections" aria-label="Разделы">
    <li v-for="c in cards" :key="c.id">
      <KCategoryCard :category="c.category" :title="c.title" :caption="caption(c.id)" :to="`/${c.id}`" />
    </li>
    <li class="sections__account"><AccountCard :logged-in="auth.isAuthed" /></li>
  </ul>
</template>

<style scoped>
/* 375: 2x2 (168x150, gap 7-8), 768: 4 в ряд (175x154, gap 12), 1380+: 5 в ряд (246x200, gap 12), пятая карточка про аккаунт */
.sections {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 7px;
  margin: 0;
  padding: 0;
  list-style: none;
}
@media (min-width: 768px) {
  .sections { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
}
/* карточка аккаунта только на desktop */
.sections__account { display: none; }
@media (min-width: 1380px) {
  .sections { grid-template-columns: repeat(5, minmax(0, 1fr)); }
  .sections__account { display: block; }
  .sections :deep(.kcat) { aspect-ratio: auto; height: 200px; }
}

/* Wide 1920: четыре раздела 194x170, карточки аккаунта нет */
@media (min-width: 1920px) {
  .sections { grid-template-columns: repeat(4, 194px); }
  .sections__account { display: none; }
  .sections :deep(.kcat) { aspect-ratio: 194 / 170; height: auto; }
}
</style>
