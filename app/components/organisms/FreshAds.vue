<script setup lang="ts">
import type { AdCard, ApiError, LoadStatus } from '~/types'
import { formatPrice, formatPublished } from '~/utils/format'

withDefaults(defineProps<{
  items: AdCard[]
  status: LoadStatus
  error?: ApiError | null
  skeletons?: number
  title?: string
  allTo?: string
}>(), { title: 'Свежие объявления', allTo: '/search' })
defineEmits<{ retry: [] }>()

const favorites = useFavoritesStore()
const viewed = useViewedStore()
const router = useRouter()
const route = useRoute()

async function toggle(card: AdCard) {
  const result = await favorites.toggle(card)
  if (result === 'auth-required') router.push({ path: '/login', query: { redirect: route.fullPath } })
}
</script>

<template>
  <section class="fresh" aria-labelledby="fresh-title" :aria-busy="status === 'loading'">
    <header class="fresh__head">
      <h2 id="fresh-title" class="fresh__title">{{ tr(title) }}</h2>
      <KButton class="fresh__all" variant="plain" :to="allTo">
        {{ tr('Смотреть все') }}
        <template #icon-right><Icon name="kango:arrow-right-24" size="20" /></template>
      </KButton>
    </header>
    <ul v-if="items.length || status === 'loading'" class="fresh__grid">
      <li v-for="card in items" :key="card.id">
        <FreshAdCard
          :section="card.section"
          :title="card.title"
          :price="formatPrice(card.price)" :variable="!!(card.price.from || (card.price.period && card.price.period !== 'total'))"
          :location="card.location"
          :published="formatPublished(card.createdAt)"
          :image="card.image"
          :favorite="card.isFavorite"
          :to="`/ad/${card.id}`"
          @toggle-favorite="toggle(card)"
          @click="viewed.add(card)"
        />
      </li>
      <template v-if="status === 'loading' && !items.length">
        <li v-for="n in (skeletons ?? 5)" :key="`s${n}`" class="fresh__skeleton" aria-hidden="true" />
      </template>
    </ul>
    <div v-if="status === 'error'" class="fresh__error" role="alert">
      <p>{{ error?.message ?? tr('Не удалось загрузить объявления') }}</p>
      <KButton variant="outline" @click="$emit('retry')">{{ tr('Повторить') }}</KButton>
    </div>
  </section>
</template>

<style scoped>
.fresh__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 20px; }
.fresh__title { min-width: 0; margin: 0; font-size: var(--text-22-24); line-height: var(--leading-22-24); font-weight: var(--font-weight-semibold); }
.fresh .fresh__all { flex: none; white-space: nowrap; height: 40px; padding-inline: 18px; border-radius: 20px; background: #fdeee2; color: var(--color-fill-primary); font-weight: var(--font-weight-medium); }
.fresh__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin: 0; padding: 0; list-style: none; }
.fresh__skeleton { min-height: 320px; border-radius: 24px; background: var(--color-fill-gray-3); animation: fresh-pulse 1.2s ease-in-out infinite; }
@keyframes fresh-pulse { 50% { opacity: 0.5; } }
.fresh__error { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 24px 0; color: var(--color-label-secondary); text-align: center; }
@media (min-width: 768px) {
  .fresh__grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .fresh__grid > :nth-child(5) { display: none; }
}
@media (min-width: 1380px) {
  .fresh__title { font-size: 36px; line-height: 40px; font-weight: 700; letter-spacing: -0.02em; }
  .fresh__grid { grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 20px; }
  .fresh__grid > :nth-child(5) { display: block; }
}
</style>
