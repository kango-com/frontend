<script setup lang="ts">
import type { Ad } from '~/types'
import { adView, formatPriceLong } from '~/utils/ad-view'
import { formatPublished } from '~/utils/format'

/** Страница объявления: галерея, цена, параметры, контакты, описание, условия, автор, жалоба. Набор блоков зависит от раздела. */
const props = defineProps<{ ad: Ad }>()

const favorites = useFavoritesStore()
const router = useRouter()
const route = useRoute()

const view = computed(() => adView(props.ad))
const isFavorite = computed(() => favorites.isFavorite(props.ad.id))
const reporting = ref(false)

async function toggleFavorite() {
  const result = await favorites.toggle(props.ad)
  if (result === 'auth-required') router.push({ path: '/login', query: { redirect: route.fullPath } })
}

const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
const location = computed(() => [props.ad.city, props.ad.district, props.ad.address].filter(Boolean).join(', '))
</script>

<template>
  <KContainer as="article" class="ad">
    <nav v-if="view.crumbs.length" class="ad__crumbs" :aria-label="tr('Хлебные крошки')">{{ view.crumbs.map(c => tr(c)).join(' - ') }}</nav>

    <div class="ad__layout">
      <div class="ad__main">
        <Gallery :images="ad.images" :alt="ad.title" :favorite="isFavorite" @toggle-favorite="toggleFavorite" />

        <section class="ad__block" aria-labelledby="ad-title">
          <p class="ad__price">{{ formatPriceLong(ad.price) }}</p>
          <h1 id="ad-title" class="ad__title">{{ ad.title }}</h1>
          <p class="ad__where">{{ trl(location) }}</p>
        </section>

        <ParamChips :items="view.chips" :label="tr('Ключевые параметры')" />

        <section v-if="ad.description" class="ad__block" aria-labelledby="ad-desc">
          <h2 id="ad-desc" class="ad__h2">{{ tr('Описание') }}</h2>
          <p class="ad__text">{{ ad.description }}</p>
        </section>

        <section v-if="view.terms.length" class="ad__block" aria-labelledby="ad-terms">
          <h2 id="ad-terms" class="ad__h2">{{ tr(view.termsTitle) }}</h2>
          <dl class="ad__terms">
            <div v-for="t in view.terms" :key="t.label" class="ad__term">
              <dt>{{ tr(t.label) }}</dt>
              <dd>{{ tr(t.value) }}</dd>
            </div>
          </dl>
        </section>
      </div>

      <aside class="ad__side" :aria-label="tr('Контакты и автор')">
        <section class="ad__block ad__contacts" aria-labelledby="ad-contacts">
          <h2 id="ad-contacts" class="ad__h2">{{ tr('Контакты') }}</h2>
          <ContactBar :phone="ad.contacts.phone" :telegram="ad.contacts.telegram" :whatsapp="ad.contacts.whatsapp" :ad-id="ad.id" />
        </section>

        <section class="ad__block" aria-labelledby="ad-author">
          <h2 id="ad-author" class="ad__h2">{{ tr('Автор объявления') }}</h2>
          <AuthorCard :name="ad.author.name" :online="ad.author.online" :since="ad.author.since" />
        </section>

        <div class="ad__actions">
          <KTextButton size="md" @click="toTop">{{ tr('Наверх') }}</KTextButton>
          <KTextButton size="md" @click="reporting = true">{{ tr('Пожаловаться на объявление') }}</KTextButton>
        </div>
      </aside>
    </div>

    <p class="ad__service">{{ tr('Объявление №') }} {{ ad.number }} · {{ formatPublished(ad.createdAt) }}</p>
    <ReportDialog v-model="reporting" :ad-id="ad.id" />
  </KContainer>
</template>

<style scoped>
.ad { display: flex; flex-direction: column; gap: 16px; padding-block: 12px 32px; }
.ad__crumbs { color: var(--color-label-secondary); font-size: var(--text-12-16); line-height: var(--leading-12-16); }
.ad__layout, .ad__main, .ad__side { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.ad__block { display: flex; flex-direction: column; gap: 8px; }
.ad__price { margin: 0; color: var(--color-label-primary); font-size: 28px; line-height: 28px; font-weight: var(--font-weight-medium); }
.ad__title { margin: 0; color: var(--color-label-primary); font-size: var(--text-20-20); line-height: var(--leading-20-20); font-weight: var(--font-weight-medium); overflow-wrap: anywhere; }
.ad__where { margin: 0; color: var(--color-label-secondary); font-size: var(--text-14-16); line-height: var(--leading-14-16); }
.ad__h2 { margin: 0; color: var(--color-label-primary); font-size: var(--text-17-20); line-height: var(--leading-17-20); font-weight: var(--font-weight-medium); }
.ad__text { margin: 0; color: var(--color-label-primary); font-size: var(--text-16-20); line-height: 24px; white-space: pre-line; overflow-wrap: anywhere; }
.ad__terms { display: flex; flex-direction: column; margin: 0; }
.ad__term { display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; border-bottom: var(--border-width) solid var(--color-stroke-gray); font-size: var(--text-15-16); line-height: var(--leading-15-16); }
.ad__term dt { color: var(--color-label-secondary); }
.ad__term dd { margin: 0; color: var(--color-label-primary); text-align: right; }
.ad__actions { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; }
.ad__service { margin: 0; color: var(--color-label-gray); font-size: var(--text-12-16); line-height: var(--leading-12-16); }

/* 768: параметры и контакты рядом с галереей не нужны, остаётся одна колонка шире */
@media (min-width: 768px) {
  .ad__main :deep(.gal__img) { aspect-ratio: 16 / 9; }
}
/* 1380+: слева галерея и описание, справа залипающая карточка с контактами */
@media (min-width: 1380px) {
  .ad { padding-block: 24px 64px; }
  .ad__layout { display: grid; grid-template-columns: minmax(0, 1fr) 380px; align-items: start; gap: 32px; }
  .ad__side { position: sticky; top: calc(var(--header-h, 104px) + 16px); padding: 20px; border: var(--border-width) solid var(--color-stroke-gray); border-radius: var(--radius-md); }
  .ad__price { font-size: 32px; line-height: 36px; }
}
</style>
