<script setup lang="ts">
import { formatPrice, formatPublished } from '~/utils/format'

const { t } = useI18n()
const viewed = useViewedStore()
const id = useId()
</script>

<template>
  <section v-if="viewed.items.length" class="viewed" :aria-labelledby="id">
    <h2 :id="id" class="viewed__title">{{ t('home.viewed') }}</h2>
    <ul class="viewed__row">
      <li v-for="card in viewed.items" :key="card.id">
        <FreshAdCard
          :section="card.section"
          :title="card.title"
          :price="formatPrice(card.price)" :variable="!!(card.price.from || (card.price.period && card.price.period !== 'total'))"
          :location="card.location"
          :published="formatPublished(card.createdAt)"
          :image="card.image"
          :to="`/ad/${card.id}`"
        />
      </li>
    </ul>
  </section>
</template>

<style scoped>
.viewed__title {
  margin: 0 0 20px;
  color: var(--color-label-primary);
  font-size: var(--text-22-24);
  line-height: var(--leading-22-24);
  font-weight: var(--font-weight-medium);
}
/* Горизонтальная лента карточек, ширина карточки как в основной сетке */
.viewed__row {
  display: flex;
  gap: 12px;
  margin: 0 calc(var(--spacing-gutter) * -1);
  padding: 0 var(--spacing-gutter);
  overflow-x: auto;
  list-style: none;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
}
.viewed__row::-webkit-scrollbar { display: none; }
.viewed__row > li { flex: none; width: 200px; scroll-snap-align: start; }
.viewed__row { padding-block: 4px 24px; margin-bottom: -20px; }
@media (min-width: 768px) {
  .viewed__row { gap: 12px; }
  .viewed__row > li { width: 230px; }
}
@media (min-width: 1380px) {
  .viewed__title { margin-bottom: 20px; font-size: 36px; line-height: 40px; font-weight: 700; letter-spacing: -0.02em; }
  .viewed__row { gap: 20px; margin-inline: -4px; padding-inline: 4px; }
  .viewed__row > li { width: 252px; }
}
</style>
