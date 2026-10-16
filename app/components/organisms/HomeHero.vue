<script setup lang="ts">
const { t } = useI18n()
const city = useCityStore()
const ui = useUiStore()
const router = useRouter()

const query = ref('')
// Слово с оранжевым росчерком под ним (мобильный и планшет): титул режем по нему
const titleParts = computed(() => {
  const start = t('hero.titleStart')
  const word = t('hero.titleUnderline')
  const i = start.indexOf(word)
  return i < 0 ? { before: start, word: '', after: '' } : { before: start.slice(0, i), word, after: start.slice(i + word.length) }
})
const submit = (q: string) => router.push({ path: '/search', query: q ? { q } : undefined })
</script>

<template>
  <div class="hero">
    <div class="hero__text">
      <h1 class="hero__title">{{ titleParts.before }}<span v-if="titleParts.word" class="hero__underline">{{ titleParts.word }}</span>{{ titleParts.after }} <span class="hero__accent">{{ t('hero.titleAccent') }}</span></h1>
      <p class="hero__subtitle">{{ t('hero.subtitle') }}</p>
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
.hero__underline { position: relative; }
.hero__underline::after {
  content: '';
  position: absolute;
  inset: auto -2px -6px;
  height: 7px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 7' preserveAspectRatio='none'%3E%3Cpath d='M1 5.5C20 2 55 1.5 99 3.2' fill='none' stroke='%23fd4a00' stroke-width='2.4' stroke-linecap='round'/%3E%3C/svg%3E") center / 100% 100% no-repeat;
}
.hero__subtitle {
  margin: 8px 0 0;
  color: var(--color-label-primary);
  font-size: var(--text-17-20);
  line-height: var(--leading-17-20);
}
/* Поиск и чипы городов: 30px под подписью, чипы через 12px */
.hero__bar { display: flex; flex-direction: column; gap: 12px; margin-top: 30px; }

/* Иврит (RTL): баннер не зеркалится, кенгуру справа, поэтому блок заголовка уходит в левую часть обложки */
@media (max-width: 1919px) {
  .hero__text:dir(rtl) { width: fit-content; margin-inline-start: auto; }
}

/* Росчерк на мобильном и планшете; на desktop акцент - оранжевое слово */
@media (min-width: 1380px) {
  .hero__underline::after { display: none; }
}

/* Планшет: заголовок сверху, поиск и города внизу обложки */
@media (min-width: 768px) {
  .hero { min-height: 341px; }
  .hero__title { max-width: none; font-family: var(--font-sans-tight); font-size: 34px; line-height: 36px; }
  .hero__bar { margin-top: auto; }
}

/* Desktop: поиск уже в шапке, в обложке крупный заголовок слева (слово «здесь» оранжевое) и подпись */
@media (min-width: 1380px) {
  .hero { min-height: 0; }
  .hero__title { max-width: 560px; font-family: var(--font-sans); font-size: 76px; line-height: 78px; font-weight: 600; letter-spacing: -0.025em; }
  .hero__accent { color: var(--color-fill-primary); }
  .hero__subtitle { margin-top: 20px; color: var(--color-label-primary); font-size: 24px; line-height: 32px; font-weight: var(--font-weight-medium); }
  .hero__bar { display: none; }
}

/* Wide 1920: заголовок справа от разделов, компактный (как в макете 1920) */
@media (min-width: 1920px) {
  .hero__title { max-width: 254px; font-family: var(--font-sans-tight); font-size: 34px; line-height: 36px; font-weight: var(--font-weight-medium); letter-spacing: 0; }
  .hero__accent { color: inherit; }
  .hero__subtitle { margin-top: 8px; color: var(--color-label-primary); font-size: var(--text-17-20); line-height: var(--leading-17-20); font-weight: 400; }
}
</style>
