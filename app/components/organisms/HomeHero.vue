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
      <h1 class="hero__title">Всё, что нужно, <span class="hero__accent">здесь</span></h1>
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

/* Desktop: поиск уже в шапке, в обложке крупный заголовок слева (слово «здесь» оранжевое) и подпись */
@media (min-width: 1380px) {
  .hero { min-height: 0; }
  .hero__title { max-width: 500px; font-family: var(--font-sans); font-size: 68px; line-height: 72px; letter-spacing: -0.01em; }
  .hero__accent { color: var(--color-fill-primary); }
  .hero__subtitle { margin-top: 12px; color: var(--color-fill-gray); font-size: 28px; line-height: 32px; }
  .hero__bar { display: none; }
}

/* Wide от 1900: заголовок справа от разделов, компактный (как в макете 1920px) */
@media (min-width: 1900px) {
  .hero__title { max-width: 254px; font-family: var(--font-sans-tight); font-size: 34px; line-height: 36px; letter-spacing: 0; }
  .hero__accent { color: inherit; }
  .hero__subtitle { margin-top: 8px; color: var(--color-label-primary); font-size: var(--text-17-20); line-height: var(--leading-17-20); }
}
</style>
