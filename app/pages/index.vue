<script setup lang="ts">
useHead({
  title: 'Kango - работа, жильё и мастера в Израиле',
  meta: [{ name: 'description', content: 'Kango - доска объявлений для русскоязычных жителей Израиля: находите работу, жильё, товары и услуги.' }]
})

const city = useCityStore()
const sections = useSectionsStore()
const ads = useAdsStore()
const viewed = useViewedStore()
const favorites = useFavoritesStore()
const auth = useAuthStore()

const recommendations = computed(() => ads.feed('recommendations'))

// Главная зависит от города: при смене загружаем всё заново
async function loadAll() {
  await Promise.all([
    city.loadPopular(),
    sections.load(city.cityIds),
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
      <AdsFeed
        title="Рекомендации"
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
.home__viewed { padding-block: 32px 40px; }
@media (min-width: 768px) {
  .home__feed { padding-top: 38px; }
}
@media (min-width: 1380px) {
  .home__feed { padding-top: 0; }
  .home__viewed { padding-block: 48px 64px; }
}
</style>
