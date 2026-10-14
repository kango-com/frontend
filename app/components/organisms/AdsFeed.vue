<script setup lang="ts">
import type { AdCard, ApiError, LoadStatus } from '~/types'
import { formatPrice, formatPublished } from '~/utils/format'

const props = withDefaults(defineProps<{
  title?: string
  items: AdCard[]
  status: LoadStatus
  hasMore?: boolean
  error?: ApiError | null
  /** Сколько скелетонов показывать при первой загрузке */
  skeletons?: number
  emptyText?: string
  /** grid: плитки с фото (по умолчанию), list: строки без фото (работа, услуги) */
  layout?: 'grid' | 'list'
}>(), { layout: 'grid', skeletons: 10, emptyText: 'Пока нет объявлений. Попробуйте выбрать другой город.' })

const emit = defineEmits<{ more: [], retry: [] }>()

const favorites = useFavoritesStore()
const viewed = useViewedStore()
const router = useRouter()
const route = useRoute()
const id = useId()

async function toggle(card: AdCard) {
  const result = await favorites.toggle(card)
  if (result === 'auth-required') router.push({ path: '/login', query: { redirect: route.fullPath } })
}

const firstLoad = computed(() => props.status === 'loading' && !props.items.length)
const isEmpty = computed(() => props.status === 'success' && !props.items.length)
</script>

<template>
  <section class="feed" :aria-labelledby="title ? id : undefined" :aria-busy="status === 'loading'">
    <h2 v-if="title" :id="id" class="feed__title">{{ title }}</h2>

    <ul v-if="items.length || firstLoad" class="feed__grid" :class="{ 'feed__grid--list': layout === 'list' }">
      <li v-for="card in items" :key="card.id">
        <AdRowCard
          v-if="layout === 'list'"
          :title="card.title"
          :price="formatPrice(card.price)"
          :tags="card.tags"
          :note="card.employer"
          :location="card.location"
          :published="formatPublished(card.createdAt)"
          :to="`/ad/${card.id}`"
          :action="card.section === 'work' ? 'Откликнуться' : 'Связаться'"
          @click="viewed.add(card)"
        />
        <KAdCard
          v-else
          :title="card.title"
          :price="formatPrice(card.price)"
          :location="card.location"
          :image="card.image"
          :favorite="card.isFavorite"
          :to="`/ad/${card.id}`"
          @toggle-favorite="toggle(card)"
          @click="viewed.add(card)"
        />
      </li>
      <template v-if="firstLoad">
        <li v-for="n in skeletons" :key="`s${n}`" class="feed__skeleton" aria-hidden="true" />
      </template>
    </ul>

    <div v-else-if="isEmpty" class="feed__empty">
      <p class="feed__note">{{ emptyText }}</p>
      <slot name="empty" />
    </div>

    <div v-if="status === 'error'" class="feed__error" role="alert">
      <p>{{ error?.message ?? 'Не удалось загрузить объявления' }}</p>
      <KButton variant="outline" @click="emit('retry')">Повторить</KButton>
    </div>

    <div v-if="hasMore && status !== 'error'" class="feed__more">
      <KButton variant="outline" :disabled="status === 'loading'" @click="emit('more')">Показать еще</KButton>
    </div>
  </section>
</template>

<style scoped>
.feed__title {
  margin: 0 0 20px;
  color: var(--color-label-primary);
  font-size: var(--text-22-24);
  line-height: var(--leading-22-24);
  font-weight: var(--font-weight-medium);
}
/* 375: 2 колонки (168x220), 768: 4 колонки (175x220), 1380+: 5 колонок (246x354) */
.feed__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 7px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.feed__grid--list { grid-template-columns: minmax(0, 1fr); gap: 8px; }
.feed__grid--list .feed__skeleton { height: 120px; }
.feed__skeleton { height: 220px; border-radius: var(--radius-md); background: var(--color-fill-gray-3); animation: feed-pulse 1.2s ease-in-out infinite; }
@keyframes feed-pulse { 50% { opacity: 0.5; } }
.feed__note { margin: 0; padding: 24px 0; color: var(--color-label-secondary); font-size: var(--text-16-20); line-height: var(--leading-16-20); text-align: center; }
.feed__empty { display: flex; flex-direction: column; align-items: center; gap: 4px; padding-bottom: 16px; }
.feed__error { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 24px 0; color: var(--color-label-secondary); text-align: center; }
.feed__error p { margin: 0; }
.feed__more { display: flex; justify-content: center; margin-top: 20px; }
.feed__more .kbtn { min-width: 240px; }

@media (min-width: 768px) {
  .feed__grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
  .feed__grid--list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (min-width: 1380px) {
  .feed__title { margin-bottom: 40px; font-size: 28px; line-height: 32px; }
  .feed__grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
  .feed__grid--list { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .feed__skeleton { height: 354px; }
  .feed__grid--list .feed__skeleton { height: 140px; }
}
</style>
