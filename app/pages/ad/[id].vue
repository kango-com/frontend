<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const ads = useAdsStore()
const viewed = useViewedStore()

const id = computed(() => String(route.params.id))
const ad = computed(() => ads.details[id.value])

watch(id, async (value) => {
  const loaded = await ads.loadDetails(value)
  if (loaded) viewed.add(loaded)
}, { immediate: true })

const notFound = computed(() => ads.detailStatus === 'error' && ads.detailError?.status === 404)
useHead({
  title: computed(() => (ad.value ? `${ad.value.title} - Kango` : 'Объявление - Kango')),
  meta: computed(() => (ad.value
    ? [
        { property: 'og:title', content: ad.value.title },
        { property: 'og:description', content: ad.value.description?.slice(0, 160) ?? '' },
        ...(ad.value.images[0] ? [{ property: 'og:image', content: ad.value.images[0] }] : [])
      ]
    : []))
})
</script>

<template>
  <AdDetails v-if="ad" :ad="ad" />

  <KContainer v-else-if="ads.detailStatus === 'error'" as="section" class="adp__state" role="alert">
    <h1>{{ notFound ? 'Объявление не найдено' : 'Не удалось загрузить объявление' }}</h1>
    <p>{{ notFound ? 'Возможно, оно удалено или ссылка неверна.' : ads.detailError?.message }}</p>
    <KButton v-if="!notFound" variant="outline" @click="ads.loadDetails(id)">Повторить</KButton>
    <KButton to="/" :variant="notFound ? 'primary' : 'neutral'">На главную</KButton>
  </KContainer>

  <KContainer v-else class="adp__skeleton" aria-busy="true" aria-label="Загрузка объявления">
    <span class="adp__bone adp__bone--img" />
    <span class="adp__bone" />
    <span class="adp__bone adp__bone--short" />
  </KContainer>
</template>

<style scoped>
.adp__state { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; padding-block: 32px 48px; }
.adp__state h1 { margin: 0; font-size: var(--text-22-24); line-height: var(--leading-22-24); font-weight: var(--font-weight-medium); }
.adp__state p { margin: 0; color: var(--color-label-secondary); }
.adp__skeleton { display: flex; flex-direction: column; gap: 12px; padding-block: 12px; }
.adp__bone { height: 28px; border-radius: var(--radius-md); background: var(--color-fill-gray-3); animation: adp-pulse 1.2s ease-in-out infinite; }
.adp__bone--img { height: 260px; }
.adp__bone--short { width: 60%; }
@keyframes adp-pulse { 50% { opacity: 0.5; } }
@media (prefers-reduced-motion: reduce) { .adp__bone { animation: none; } }
</style>
