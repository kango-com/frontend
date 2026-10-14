<script setup lang="ts">
import { formatPrice } from '~/utils/format'

const { t } = useI18n()
const viewed = useViewedStore()
const id = useId()
</script>

<template>
  <section v-if="viewed.items.length" class="viewed" :aria-labelledby="id">
    <h2 :id="id" class="viewed__title">{{ t('home.viewed') }}</h2>
    <ul class="viewed__row">
      <li v-for="card in viewed.items" :key="card.id">
        <KAdCard
          :title="card.title"
          :price="formatPrice(card.price)"
          :location="card.location"
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
  gap: 7px;
  margin: 0 calc(var(--spacing-gutter) * -1);
  padding: 0 var(--spacing-gutter);
  overflow-x: auto;
  list-style: none;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
}
.viewed__row::-webkit-scrollbar { display: none; }
.viewed__row > li { flex: none; width: 168px; scroll-snap-align: start; }
@media (min-width: 768px) {
  .viewed__row { gap: 12px; }
  .viewed__row > li { width: 175px; }
}
@media (min-width: 1380px) {
  .viewed__title { margin-bottom: 40px; font-size: 28px; line-height: 32px; }
  .viewed__row { margin: 0; padding: 0; }
  .viewed__row > li { width: 246px; }
}
</style>
