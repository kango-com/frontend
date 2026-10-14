<script setup lang="ts">
import { paymentsApi } from '~/api'

definePageMeta({ layout: 'minimal' })
useHead({ title: 'Объявление опубликовано - Kango' })

const route = useRoute()
const router = useRouter()
const draft = useDraftAdStore()

const state = ref<'loading' | 'paid' | 'skipped' | 'failed'>('loading')
const adId = ref<string | undefined>()

onMounted(async () => {
  const paymentId = typeof route.query.payment === 'string' ? route.query.payment : ''
  if (paymentId) {
    try {
      const status = await paymentsApi.status(paymentId)
      adId.value = status.adId
      state.value = status.status === 'paid' ? 'paid' : 'failed'
    } catch {
      state.value = 'failed'
    }
  } else if (typeof route.query.ad === 'string') {
    adId.value = route.query.ad
    state.value = 'skipped'
  } else {
    router.replace('/new')
    return
  }
  // оплата не прошла: возвращаем на шаг продвижения с сообщением
  if (state.value === 'failed') {
    const query: Record<string, string> = { status: String(route.query.status ?? 'failed') }
    if (route.query.existing && adId.value) query.ad = adId.value
    await router.replace({ path: '/new/promote', query })
    return
  }
  // продвижение из профиля не должно стирать незавершённый черновик подачи
  if (!route.query.existing) draft.reset()
})
</script>

<template>
  <PublishSuccess v-if="state === 'paid' || state === 'skipped'" :promoted="state === 'paid'" :ad-id="adId" />
  <KContainer v-else class="succ__wait" aria-busy="true">Проверяем оплату...</KContainer>
</template>

<style scoped>
.succ__wait { padding-block: 48px; color: var(--color-label-secondary); text-align: center; }
</style>
