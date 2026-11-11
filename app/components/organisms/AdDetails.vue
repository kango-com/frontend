<script setup lang="ts">
import type { Ad } from '~/types'
import { adView, formatPriceLong } from '~/utils/ad-view'
import { formatPublished } from '~/utils/format'
import { referencesApi } from '~/api'
import type { KeyParam } from '~/components/molecules/KeyParams.vue'
import briefcaseIcon from '~/assets/img/icons/briefcase.webp'
import avatarIcon from '~/assets/img/icons/avatar.webp'
import calendarIcon from '~/assets/img/icons/calendar.webp'
import growthIcon from '~/assets/img/icons/growth.webp'
import documentIcon from '~/assets/img/icons/document.webp'
import slidersIcon from '~/assets/img/icons/sliders.webp'
import phoneIcon from '~/assets/img/icons/phone.webp'
import pinIcon from '~/assets/img/icons/pin.webp'

/** Страница объявления: галерея, цена, параметры, контакты, описание, условия, автор, жалоба, похожие. Набор блоков зависит от раздела. */
const props = defineProps<{ ad: Ad }>()

const favorites = useFavoritesStore()
const ads = useAdsStore()
const router = useRouter()
const route = useRoute()

const view = computed(() => adView(props.ad))
const isFavorite = computed(() => favorites.isFavorite(props.ad.id))
const reporting = ref(false)
const shared = ref(false)

async function toggleFavorite() {
  const result = await favorites.toggle(props.ad)
  if (result === 'auth-required') router.push({ path: '/login', query: { redirect: route.fullPath } })
}

async function share() {
  const url = window.location.href
  try {
    if (navigator.share) await navigator.share({ title: props.ad.title, url })
    else { await navigator.clipboard.writeText(url); shared.value = true; setTimeout(() => { shared.value = false }, 1800) }
  } catch { /* пользователь закрыл окно «Поделиться» */ }
}

const location = computed(() => [props.ad.city, props.ad.district, props.ad.address].filter(Boolean).join(', '))

// знак ₪ рисуем системным шрифтом: в Onest глифа ₪ нет
const priceParts = computed(() => {
  const text = formatPriceLong(props.ad.price)
  const i = text.indexOf('₪')
  return i < 0 ? { before: text, after: '', has: false } : { before: text.slice(0, i), after: text.slice(i + 1), has: true }
})

// Вакансия: блок ключевых параметров (категория, занятость, график, опыт) вместо чипов
const workCategory = ref('')
watch(() => props.ad.section === 'work' ? props.ad.params.categoryId : '', async (id) => {
  if (!id) return
  try {
    const list = await referencesApi.workCategories()
    workCategory.value = list.find(c => c.id === id)?.title ?? ''
  } catch { workCategory.value = '' }
}, { immediate: true })
const keyParams = computed<KeyParam[]>(() => {
  const a = props.ad
  if (a.section !== 'work') return []
  const p = a.params
  return [
    { icon: briefcaseIcon, label: 'Категория', value: tr(workCategory.value) || '-' },
    { icon: avatarIcon, label: 'Тип занятости', value: p.employment.map(x => tr(x)).join(', ') || '-' },
    { icon: calendarIcon, label: 'График', value: p.schedule.map(x => tr(x)).join(', ') || '-' },
    { icon: growthIcon, label: 'Опыт', value: p.experience === 'none' ? tr('Без опыта') : tr('Нужен опыт') }
  ]
})

// Похожие: свежие объявления того же раздела (без текущего)
const similarQuery = computed(() => ({ section: props.ad.section, sort: 'date' as const, cityIds: [] as string[] }))
const similarFeed = computed(() => ads.feed(ads.queryKey(similarQuery.value)))
const similar = computed(() => similarFeed.value.items.filter(c => c.id !== props.ad.id).slice(0, 5))
watch(() => props.ad.section, () => ads.loadList(similarQuery.value), { immediate: true })
</script>

<template>
  <KContainer as="article" class="ad">
    <nav class="ad__crumbs" :aria-label="tr('Хлебные крошки')">
      <NuxtLink to="/" class="ad__crumb">{{ tr('Объявления') }}</NuxtLink>
      <template v-for="(c, i) in view.crumbs" :key="c + i">
        <Icon name="kango:chevron-right-16" size="14" class="ad__sep" />
        <span class="ad__crumb" :class="{ 'ad__crumb--last': i === view.crumbs.length - 1 }">{{ tr(c) }}</span>
      </template>
    </nav>

    <div class="ad__layout">
      <div class="ad__main">
        <Gallery :images="ad.images" :alt="ad.title" no-favorite />

        <section class="ad__head" aria-labelledby="ad-title">
          <div class="ad__pricebar">
            <p class="ad__price">{{ priceParts.before }}<span v-if="priceParts.has" class="ad__cur">₪</span>{{ priceParts.after }}</p>
            <div class="ad__tools">
              <button type="button" class="ad__share ad__fav" :class="{ 'ad__fav--on': isFavorite }" :aria-pressed="isFavorite" :aria-label="isFavorite ? tr('Убрать из избранного') : tr('В избранное')" @click="toggleFavorite">
                <Icon name="kango:heart-24" size="24" />
              </button>
              <button type="button" class="ad__share" :aria-label="tr('Поделиться')" @click="share">
                <Icon name="kango:share-24" size="24" />
                <span v-if="shared" class="ad__hint" role="status">{{ tr('Ссылка скопирована') }}</span>
              </button>
            </div>
          </div>
          <h1 id="ad-title" class="ad__title">{{ ad.title }}</h1>
          <p class="ad__where"><img :src="pinIcon" class="ad__pin" alt="" width="22" height="22">{{ trl(location) }}</p>
        </section>

        <KeyParams v-if="ad.section === 'work'" :items="keyParams" />
        <ParamChips v-else :items="view.chips" :label="tr('Ключевые параметры')" />

        <section v-if="ad.description" class="ad__card" aria-labelledby="ad-desc">
          <h2 id="ad-desc" class="ad__h2"><span class="ad__badge"><img :src="documentIcon" alt="" width="28" height="28"></span>{{ tr('Описание') }}</h2>
          <p class="ad__text">{{ ad.description }}</p>
        </section>

        <section v-if="view.terms.length" class="ad__card" aria-labelledby="ad-terms">
          <h2 id="ad-terms" class="ad__h2"><span class="ad__badge"><img :src="slidersIcon" alt="" width="28" height="28"></span>{{ tr(view.termsTitle) }}</h2>
          <dl class="ad__terms">
            <div v-for="t in view.terms" :key="t.label" class="ad__term">
              <dt>{{ tr(t.label) }}</dt>
              <dd>{{ tr(t.value) }}</dd>
            </div>
          </dl>
        </section>
        <AdLocationMap v-if="ad.section === 'realty' && ad.coordinates" :deal="ad.params.deal" :ad-id="ad.id" :title="ad.title" :point="ad.coordinates" :approximate="ad.hideExactLocation" :address="ad.hideExactLocation ? undefined : location" />
      </div>

      <aside class="ad__side" :aria-label="tr('Контакты и автор')">
        <section class="ad__contacts" aria-labelledby="ad-contacts">
          <h2 id="ad-contacts" class="ad__h2"><span class="ad__badge"><img :src="phoneIcon" alt="" width="28" height="28"></span>{{ tr('Контакты') }}</h2>
          <ContactBar :phone="ad.contacts.phone" :telegram="ad.contacts.telegram" :whatsapp="ad.contacts.whatsapp" :ad-id="ad.id" :hidden="ad.contactsHidden" :kinds="ad.contactKinds" />
        </section>

        <section class="ad__author" aria-labelledby="ad-author">
          <h2 id="ad-author" class="ad__sr">{{ tr('Автор объявления') }}</h2>
          <AuthorCard class="ad__authorcard" :name="ad.author.name" :online="ad.author.online" :since="ad.author.since" />
          <button type="button" class="ad__report" :aria-label="tr('Пожаловаться на объявление')" :title="tr('Пожаловаться на объявление')" @click="reporting = true">
            <Icon name="kango:flag-24" size="24" />
          </button>
        </section>
      </aside>
    </div>

    <FreshAds v-if="similar.length" class="ad__similar" :items="similar" :status="similarFeed.status" :title="'Похожие объявления'" :all-to="`/${ad.section}`" />

    <p class="ad__service">{{ tr('Объявление №') }} {{ ad.number }} · {{ formatPublished(ad.createdAt) }}</p>
    <ReportDialog v-model="reporting" :ad-id="ad.id" />
  </KContainer>
</template>

<style scoped>
.ad { display: flex; flex-direction: column; gap: 16px; padding-block: 12px 32px; }
.ad__crumbs { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; color: var(--color-label-secondary); font-size: var(--text-13-16); line-height: var(--leading-13-16); }
.ad__crumb { color: inherit; text-decoration: none; }
.ad__crumb--last { color: var(--color-label-primary); }
.ad__sep { flex: none; color: var(--color-label-gray); }
.ad__layout, .ad__main, .ad__side { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.ad__head { display: flex; flex-direction: column; gap: 8px; }
.ad__pricebar { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.ad__price { margin: 0; color: var(--color-fill-primary); font-size: 30px; line-height: 36px; font-weight: 700; letter-spacing: -0.01em; }
.ad__cur { margin-inline-start: 2px; font-family: Arial, 'Segoe UI', sans-serif; font-size: 0.92em; }
.ad__tools { display: flex; align-items: center; gap: 8px; }
.ad__share { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border: var(--border-width) solid var(--color-stroke-gray); border-radius: var(--radius-md); background: var(--color-fill-white); color: var(--color-label-primary); cursor: pointer; }
.ad__share:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
.ad__fav { color: var(--color-fill-primary); }
.ad__fav--on { border-color: var(--color-fill-primary); background: #fdeee2; }
.ad__fav--on :deep(path) { fill: var(--color-fill-primary); }
.ad__hint { position: absolute; top: calc(100% + 6px); right: 0; padding: 6px 10px; border-radius: 10px; background: var(--color-label-primary); color: var(--color-label-white); font-size: var(--text-12-16); white-space: nowrap; }
.ad__title { margin: 0; color: var(--color-label-primary); font-size: 26px; line-height: 32px; font-weight: 700; letter-spacing: -0.01em; overflow-wrap: anywhere; }
.ad__where { display: flex; align-items: center; gap: 8px; margin: 0; color: var(--color-label-secondary); font-size: var(--text-15-16); line-height: 20px; }
.ad__pin { flex: none; width: 22px; height: 22px; object-fit: contain; }
.ad__card, .ad__side { padding: 20px; border: 1px solid color-mix(in srgb, var(--color-label-primary) 8%, transparent); border-radius: 24px; background: var(--color-fill-white); }
.ad__card { display: flex; flex-direction: column; gap: 12px; }
.ad__h2 { display: flex; align-items: center; gap: 12px; margin: 0; color: var(--color-label-primary); font-size: 20px; line-height: 24px; font-weight: 700; }
.ad__badge { display: inline-flex; flex: none; align-items: center; justify-content: center; width: 44px; height: 44px; }
.ad__badge img { display: block; width: 36px; height: 36px; object-fit: contain; }
.ad__text { margin: 0; color: var(--color-label-primary); font-size: var(--text-16-20); line-height: 24px; white-space: pre-line; overflow-wrap: anywhere; }
.ad__terms { display: flex; flex-direction: column; margin: 0; }
.ad__term { display: flex; justify-content: space-between; gap: 12px; padding: 12px 0; font-size: var(--text-15-16); line-height: var(--leading-15-16); }
.ad__term + .ad__term { border-top: 1px solid color-mix(in srgb, var(--color-label-primary) 8%, transparent); }
.ad__term dt { color: var(--color-label-secondary); }
.ad__term dd { margin: 0; color: var(--color-label-primary); font-weight: var(--font-weight-medium); text-align: right; }
.ad__contacts { display: flex; flex-direction: column; gap: 14px; }
.ad__author { display: flex; align-items: center; gap: 12px; padding-top: 16px; border-top: 1px solid color-mix(in srgb, var(--color-label-primary) 8%, transparent); }
.ad__authorcard { flex: 1; min-width: 0; }
.ad__report { display: inline-flex; flex: none; align-items: center; justify-content: center; width: 40px; height: 40px; border: 0; border-radius: 50%; background: #ffe9e6; color: #e5321f; cursor: pointer; transition: background-color 0.15s ease-out; }
.ad__report:hover { background: #ffd9d4; }
.ad__report:focus-visible { outline: var(--border-width-strong) solid #e5321f; outline-offset: 2px; }
.ad__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
.ad__service { margin: 0; color: var(--color-label-gray); font-size: var(--text-12-16); line-height: var(--leading-12-16); }
.ad__similar { margin-top: 24px; }

/* 768: одна колонка шире */
@media (min-width: 768px) {
  .ad__main :deep(.gal__img) { aspect-ratio: 16 / 9; }
}
/* 1380+: слева галерея и описание, справа залипающая карточка с контактами */
@media (min-width: 1380px) {
  .ad { max-width: 1540px; padding-block: 16px 64px; }
  .ad__layout { display: grid; grid-template-columns: minmax(0, 1fr) 380px; align-items: start; gap: 24px; }
  .ad__side { position: sticky; top: calc(var(--header-h, 76px) + 16px); }
  .ad__price { font-size: 36px; line-height: 40px; }
  .ad__title { font-size: 30px; line-height: 36px; }
}
</style>
