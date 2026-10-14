<script setup lang="ts">
import type { PromoPackageId } from '~/types'
import { formatPriceLong } from '~/utils/ad-view'

/** Продвижение опубликованного объявления: выбор пакета, оплата или пропуск */
const props = defineProps<{
  /** Продвигается уже опубликованное объявление (из профиля), а не только что поданное */
  adId: string
  existing?: boolean
}>()
const emit = defineEmits<{ skip: [] }>()

const store = useDraftAdStore()
const router = useRouter()
const route = useRoute()
const ads = useAdsStore()

onMounted(() => {
  store.loadPackages()
  if (props.existing) ads.loadDetails(props.adId)
})

// краткая информация об объявлении: из черновика после подачи или из загруженной карточки
const summary = computed(() => (props.existing ? ads.details[props.adId] : store.draft))

const busy = computed(() => store.status === 'loading')
const failed = computed(() => route.query.status === 'failed' || route.query.status === 'cancelled')
const BADGES: Partial<Record<PromoPackageId, string>> = { max: 'Экономия 20%' }

async function pay() {
  const url = await store.pay(props.existing ? '/new/success?existing=1' : '/new/success', props.adId)
  if (url) await router.push(url)
}
</script>

<template>
  <section class="prom" aria-labelledby="prom-title">
    <h1 id="prom-title" class="prom__title">{{ tr('Продвинуть объявление') }}</h1>

    <div v-if="summary?.title" class="prom__ad">
      <span class="prom__ad-title">{{ summary.title }}</span>
      <span v-if="summary.price" class="prom__ad-price">{{ formatPriceLong(summary.price) }}</span>
    </div>

    <p v-if="failed" class="prom__alert" role="alert">{{ tr('Оплата не прошла. Попробуйте ещё раз или опубликуйте без продвижения.') }}</p>
    <p v-else-if="store.error" class="prom__alert" role="alert">{{ store.error.message }}</p>

    <div class="prom__list" role="radiogroup" aria-labelledby="prom-title">
      <PromoCard
        v-for="p in store.packages"
        :key="p.id"
        :title="p.title"
        :price="p.price"
        :description="p.description"
        :badge="BADGES[p.id]"
        :selected="store.selectedPackage === p.id"
        @select="store.selectedPackage = p.id"
      />
      <p v-if="!store.packages.length" class="prom__note" aria-busy="true">{{ tr('Загрузка вариантов...') }}</p>
    </div>

    <KButton block :disabled="!store.selectedPackage || busy" @click="pay">{{ busy ? tr('Переходим к оплате...') : tr('Оплатить') }}</KButton>
    <KButton block variant="neutral" :disabled="busy" @click="emit('skip')">{{ existing ? tr('Не сейчас') : tr('Продвинуть позже') }}</KButton>
  </section>
</template>

<style scoped>
.prom { display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 560px; margin-inline: auto; padding: 24px 16px 40px; }
.prom__title { margin: 0; font-size: var(--text-22-24); line-height: var(--leading-22-24); font-weight: var(--font-weight-medium); }
.prom__ad { display: flex; flex-direction: column; gap: 2px; padding: 12px 16px; border-radius: var(--radius-md); background: var(--color-fill-gray-3); }
.prom__ad-title { font-size: var(--text-16-20); font-weight: var(--font-weight-medium); overflow-wrap: anywhere; }
.prom__ad-price { color: var(--color-label-secondary); font-size: var(--text-14-16); }
.prom__alert { margin: 0; padding: 12px 16px; border-radius: var(--radius-md); background: color-mix(in srgb, var(--color-fill-error) 10%, transparent); color: var(--color-fill-error); font-size: var(--text-14-16); }
.prom__list { display: flex; flex-direction: column; gap: 8px; }
.prom__note { margin: 0; color: var(--color-label-secondary); text-align: center; }
</style>
