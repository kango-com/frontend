<script setup lang="ts">
import type { Section } from '~/types'
import { formatAdsCount } from '~/utils/format'

const { t, locale } = useI18n()
const sections = useSectionsStore()
const auth = useAuthStore()

const cards: { id: Section, category: 'work' | 'real-estate' | 'goods' | 'services', hint: string, icon: string }[] = [
  { id: 'work', category: 'work', hint: 'Вакансии и резюме', icon: 'kango:briefcase-24' },
  { id: 'realty', category: 'real-estate', hint: 'Аренда, покупка, продажа', icon: 'kango:home-24' },
  { id: 'goods', category: 'goods', hint: 'Товары и техника', icon: 'kango:bag-24' },
  { id: 'services', category: 'services', hint: 'Ремонт, красота, обучение', icon: 'kango:wrench-24' }
]

const caption = (id: Section) => {
  const s = sections.byId(id)
  return s ? formatAdsCount(s.count, locale.value as 'ru' | 'en' | 'he') : undefined
}
</script>

<template>
  <ul class="sections">
    <li v-for="c in cards" :key="c.id">
      <KCategoryCard :category="c.category" :title="t(`sections.${c.id}`)" :caption="caption(c.id)" :hint="tr(c.hint)" :to="`/${c.id}`" />
    </li>
    <li class="sections__account"><AccountCard :logged-in="auth.isAuthed" /></li>
  </ul>
</template>

<style scoped>
/* 375: 2x2 (168x150, gap 7-8), 768: 4 в ряд (175x154, gap 12), 1380+: 4 в ряд (высота 136, gap 20) */
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
/* Без счётчиков объявлений на всех ширинах: только название и стрелка, как в макете */
.sections :deep(.kcat__caption) { display: none; }
/* карточка аккаунта только на desktop */
.sections__account { display: none; }
@media (min-width: 1380px) {
  .sections { gap: 20px; grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .sections :deep(.kcat) { aspect-ratio: auto; height: 150px; padding: 18px; border-radius: 20px; }
  .sections :deep(.kcat__title) { font-size: 20px; line-height: 24px; font-weight: var(--font-weight-semibold); }
  .sections :deep(.kcat__hint) { display: block; }
  .sections :deep(.kcat__arrow) { color: var(--color-fill-color-3); }
}
</style>
