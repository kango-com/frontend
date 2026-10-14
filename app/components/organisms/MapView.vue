<script setup lang="ts">
import type { AdsQuery } from '~/types'

/**
 * Карта: провайдер карт не выбран, поэтому вместо интерактивной карты блок-заглушка
 * и список объявлений города (те же данные пойдут на маркеры).
 */
const city = useCityStore()
const ads = useAdsStore()

const query = computed<AdsQuery>(() => ({ cityIds: city.cityIds }))
const feed = computed(() => ads.feed(ads.queryKey(query.value)))
watch(() => city.current.id, () => ads.loadList(query.value), { immediate: true })
</script>

<template>
  <KContainer as="section" class="mapv" aria-labelledby="mapv-title">
    <h1 id="mapv-title" class="mapv__title">Карта</h1>
    <div class="mapv__map" role="img" :aria-label="`Карта объявлений: ${city.current.name}`">
      <Icon name="kango:map-24" size="24" />
      <span class="mapv__big">{{ city.current.name }}</span>
      <span>Интерактивная карта появится после выбора провайдера</span>
    </div>
    <AdsFeed
      title="Объявления в городе"
      :items="feed.items"
      :status="feed.status"
      :has-more="feed.hasMore"
      :error="feed.error"
      @more="ads.loadMoreList(query)"
      @retry="ads.loadList(query)"
    />
  </KContainer>
</template>

<style scoped>
.mapv { display: flex; flex-direction: column; gap: 16px; padding-block: 16px 40px; }
.mapv__title { margin: 0; font-size: var(--text-22-24); line-height: var(--leading-22-24); font-weight: var(--font-weight-medium); }
.mapv__map { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; height: 240px; border-radius: var(--radius-md); background: var(--color-fill-tint); color: var(--color-label-secondary); font-size: var(--text-14-16); text-align: center; padding: 16px; }
.mapv__big { color: var(--color-label-primary); font-size: var(--text-20-20); font-weight: var(--font-weight-medium); }
@media (min-width: 768px) { .mapv__map { height: 320px; } }
@media (min-width: 1380px) { .mapv { padding-block: 32px 64px; } .mapv__map { height: 400px; } .mapv__title { font-size: 28px; line-height: 32px; } }
</style>
