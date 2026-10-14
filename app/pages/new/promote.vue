<script setup lang="ts">
definePageMeta({ layout: 'minimal', middleware: 'auth' })
useHead({ title: 'Продвинуть объявление - Kango' })

const draft = useDraftAdStore()
const route = useRoute()
const router = useRouter()

// ?ad=<id>: продвижение уже опубликованного объявления из профиля, иначе только что поданное из черновика
const existing = computed(() => typeof route.query.ad === 'string')
const adId = computed(() => (existing.value ? String(route.query.ad) : draft.createdId))

onMounted(() => {
  if (!adId.value) draft.restore()
  if (!adId.value) router.replace('/new')
})

async function skip() {
  if (existing.value) { await router.push('/profile'); return }
  await router.push({ path: '/new/success', query: adId.value ? { ad: adId.value } : undefined })
}
</script>

<template>
  <PromotePanel v-if="adId" :ad-id="adId" :existing="existing" @skip="skip" />
</template>
