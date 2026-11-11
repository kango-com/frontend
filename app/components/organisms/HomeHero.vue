<script setup lang="ts">
const { t, locale } = useI18n()
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
const popular = ['Работа в IT', 'Аренда квартиры', 'Авто', 'Ремонт', 'Детские товары']
const submit = (q: string) => router.push({ path: '/search', query: q ? { q } : undefined })
</script>

<template>
  <div class="hero">
    <div class="hero__text">
      <span class="hero__badge"><Icon name="kango:map-pin-12" size="12" />{{ tr('Доска объявлений · Израиль') }}</span>
      <h1 class="hero__title">{{ titleParts.before }}<span v-if="titleParts.word" class="hero__underline">{{ titleParts.word }}</span>{{ titleParts.after }} <span class="hero__accent">{{ t('hero.titleAccent') }}</span><span class="hero__desk-only">&nbsp;{{ tr('на') }}{{ locale === 'he' ? '' : '\u00a0' }}<span class="hero__brand">Kango</span></span></h1>
      <p class="hero__subtitle">{{ t('hero.subtitle') }}<span class="hero__desk-only">{{ tr(' и многое другое в одном удобном сервисе для жизни в Израиле') }}</span></p>
    </div>
    <div class="hero__desk">
      <form class="hero__form" role="search" @submit.prevent="submit(query)">
        <Icon name="kango:search-24" size="24" class="hero__form-icon" />
        <input v-model="query" class="hero__input" type="search" :placeholder="t('nav.searchPlaceholder')" :aria-label="t('nav.searchPlaceholder')">
        <button type="button" class="hero__city" @click="ui.open('city')">
          <Icon name="kango:map-pin-16" size="16" />{{ tr(city.current.name) }}<Icon name="kango:chevron-down-16" size="16" />
        </button>
        <KButton type="submit" class="hero__find">{{ t('nav.find') }}<template #icon-right><Icon name="kango:arrow-right-24" size="20" /></template></KButton>
      </form>
      <div class="hero__popular">
        <span class="hero__popular-label">{{ tr('Популярное:') }}</span>
        <button v-for="p in popular" :key="p" type="button" class="hero__pop" @click="submit(p)">{{ tr(p) }}</button>
      </div>
    </div>
    <div class="hero__bar">
      <SearchBar v-model="query" @submit="submit" @focus="router.push('/search')" @filter="ui.open('filters')" />
      <CityChips :cities="city.chips" :active-id="city.current.id" @select="city.select" />
    </div>
  </div>
</template>

<style scoped>
.hero { display: flex; flex-direction: column; }
.hero__badge, .hero__desk, .hero__desk-only { display: none; }
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

/* Desktop: плашка, крупный заголовок («Kango» оранжевое), подпись, поле поиска с городом и «Найти», популярные запросы */
@media (min-width: 1380px) {
  .hero { min-height: 0; max-width: 680px; }
  /* иврит: фото с кенгуру остаётся справа, поэтому блок с текстом уходит влево */
  .hero:dir(rtl) { margin-inline-start: auto; }
  .hero__badge { display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; margin-bottom: 20px; padding: 6px 14px; border-radius: var(--radius-pill); background: color-mix(in srgb, var(--color-fill-primary) 12%, var(--color-page)); color: var(--color-label-primary); font-size: var(--text-12-16); line-height: var(--leading-12-16); }
  .hero__badge :deep(svg) { color: var(--color-fill-primary); }
  .hero__title { max-width: 520px; font-family: var(--font-sans); font-size: 52px; line-height: 54px; font-weight: 700; letter-spacing: -0.025em; }
  .hero__accent { color: inherit; }
  .hero__desk-only { display: inline; }
  .hero__brand { color: var(--color-fill-primary); }
  .hero__subtitle { max-width: 440px; margin-top: 14px; font-size: 17px; line-height: 23px; font-weight: var(--font-weight-regular); }
  .hero__bar { display: none; }
  .hero__desk { display: block; margin-top: 26px; }
  .hero__form { display: flex; align-items: center; gap: 12px; width: 620px; height: 58px; padding: 0 8px 0 20px; border-radius: 32px; background: var(--color-fill-white); box-shadow: 0 6px 24px color-mix(in srgb, var(--color-fill-primary) 18%, transparent), 0 1px 3px color-mix(in srgb, var(--color-label-primary) 10%, transparent); }
  .hero__form:focus-within { outline: var(--border-width-strong) solid var(--color-stroke-primary); }
  .hero__form-icon { flex: none; color: var(--color-fill-primary); }
  .hero__input { flex: 1; min-width: 0; height: 100%; padding: 0; border: 0; outline: 0; background: none; color: var(--color-label-primary); font-family: inherit; font-size: 17px; }
  .hero__input::placeholder { color: var(--color-label-secondary); }
  .hero__input::-webkit-search-cancel-button { display: none; }
  .hero__city { display: inline-flex; flex: none; align-items: center; gap: 6px; height: 40px; padding: 0 12px 0 20px; border: 0; border-inline-start: 1px solid var(--color-separator-gray); background: none; color: var(--color-label-primary); font-family: inherit; font-size: var(--text-16-20); font-weight: var(--font-weight-medium); cursor: pointer; }
  .hero__city :deep(svg:first-child) { color: var(--color-fill-color-3); }
  .hero .hero__find { flex: none; height: 48px; padding-inline: 24px; border-radius: 24px; }
  .hero__popular { display: flex; flex-wrap: nowrap; align-items: center; gap: 10px; margin-top: 14px; }
  .hero__popular-label { color: var(--color-label-primary); font-size: var(--text-13-16); }
  .hero__pop { flex: none; height: 30px; padding: 0 14px; border: 0; border-radius: var(--radius-pill); background: var(--color-fill-white); box-shadow: 0 1px 3px color-mix(in srgb, var(--color-label-primary) 12%, transparent); color: var(--color-label-primary); font-family: inherit; font-size: var(--text-13-16); cursor: pointer; transition: background-color 0.15s ease-out; }
  .hero__pop:hover { background: var(--color-fill-tint); }
  .hero__pop:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
}
</style>
