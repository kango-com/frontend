<script setup lang="ts">
const { t } = useI18n()
useHead({
  title: () => tr('Kango - работа, жильё и мастера в Израиле'),
  meta: [{ name: 'description', content: () => tr('Kango - доска объявлений для русскоязычных жителей Израиля: находите работу, жильё, товары и услуги.') }]
})

const city = useCityStore()
const sections = useSectionsStore()
const ads = useAdsStore()
const viewed = useViewedStore()
const favorites = useFavoritesStore()
const auth = useAuthStore()

const recommendations = computed(() => ads.feed('recommendations'))
// Свежие: последние по дате публикации, одна строка плиток
const FRESH = 5
const freshQuery = computed(() => ({ sort: 'date' as const, cityIds: city.cityIds }))
const fresh = computed(() => ads.feed(ads.queryKey(freshQuery.value)))
const freshItems = computed(() => fresh.value.items.slice(0, FRESH))

// Главная зависит от города: при смене загружаем всё заново
async function loadAll() {
  await Promise.all([
    city.loadPopular(),
    sections.load(city.cityIds),
    ads.loadList(freshQuery.value),
    ads.loadRecommendations(city.cityIds),
    viewed.load(),
    auth.isAuthed ? favorites.load() : Promise.resolve()
  ])
  return null
}
useAsyncData('home', loadAll, { watch: [() => city.current.id] })

const cover = ref<{ $el: HTMLElement }>()
useHeaderOverCover(computed(() => cover.value?.$el) as unknown as Ref<HTMLElement | undefined>)
</script>

<template>
  <div class="home">
    <HomeCover ref="cover" />
    <KContainer class="home__feed">
      <FreshAds
        :items="freshItems"
        :status="fresh.status"
        :skeletons="FRESH"
        :error="fresh.error"
        @retry="ads.loadList(freshQuery)"
      />
    </KContainer>
    <KContainer class="home__pwa">
      <PwaPromo />
    </KContainer>
    <KContainer class="home__recs">
      <AdsFeed
        :title="t('home.recommendations')"
        :items="recommendations.items"
        :status="recommendations.status"
        :has-more="recommendations.hasMore"
        :error="recommendations.error"
        @more="ads.loadMoreRecommendations(city.cityIds)"
        @retry="ads.loadRecommendations(city.cityIds)"
      />
    </KContainer>
    <KContainer class="home__viewed">
      <ViewedAds />
    </KContainer>
  </div>
</template>

<style scoped>
/* Отступы между блоками (375 / 768 / 1380+) */
.home__feed { padding-top: 46px; }
.home__pwa { padding-top: 32px; }
.home__recs { padding-top: 40px; }
.home__viewed { padding-block: 32px 40px; }
@media (min-width: 768px) {
  .home__feed { padding-top: 38px; }
}
@media (min-width: 1380px) {
  /* на главной сетка шире общей: 1540 с полями 50 даёт 1440px контента */
  .home :deep(.kcontainer) { max-width: 1540px; }
  .home__feed { padding-top: 64px; }
  .home__viewed { padding-block: 48px 64px; }
}
</style>
