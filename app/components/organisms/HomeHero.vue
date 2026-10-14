<script setup lang="ts">
const city = useCityStore()
const ui = useUiStore()
const router = useRouter()

const query = ref('')
const submit = (q: string) => router.push({ path: '/search', query: q ? { q } : undefined })
</script>

<template>
  <div class="hero">
    <div class="hero__text">
      <h1 class="hero__title">Всё, что нужно, здесь</h1>
      <p class="hero__subtitle">Работа, жильё, товары, услуги</p>
    </div>
    <div class="hero__bar">
      <SearchBar v-model="query" @submit="submit" @focus="router.push('/search')" @filter="ui.open('filters')" />
      <CityChips :cities="city.chips" :active-id="city.current.id" @select="city.select" />
    </div>
  </div>
</template>

<style scoped>
.hero { display: flex; flex-direction: column; }
.hero__title {
  max-width: 200px;
  margin: 0;
  color: var(--color-label-primary);
  font-size: var(--text-28-28);
  line-height: var(--leading-28-28);
  font-weight: var(--font-weight-medium);
}
.hero__subtitle {
  margin: 8px 0 0;
  color: var(--color-label-primary);
  font-size: var(--text-17-20);
  line-height: var(--leading-17-20);
}
/* Поиск и чипы городов: 30px под подписью, чипы через 12px */
.hero__bar { display: flex; flex-direction: column; gap: 12px; margin-top: 30px; }

/* Планшет: заголовок сверху, поиск и города внизу обложки */
@media (min-width: 768px) {
  .hero { min-height: 341px; }
  .hero__title { max-width: none; font-family: var(--font-sans-tight); font-size: 34px; line-height: 36px; }
  .hero__bar { margin-top: auto; }
}

/* Desktop: поиск уже в шапке, в обложке остаются заголовок и подпись */
@media (min-width: 1380px) {
  .hero { min-height: 0; }
  .hero__title { max-width: 254px; }
  .hero__bar { display: none; }
}
</style>
