<script setup lang="ts">
definePageMeta({ layout: 'minimal', middleware: 'auth' })
useHead({ title: 'Продвинуть объявление - Kango' })

const draft = useDraftAdStore()
const router = useRouter()

// без созданного объявления продвигать нечего
onMounted(() => { if (!draft.createdId) router.replace('/new') })

async function skip() {
  const id = draft.createdId
  await router.push({ path: '/new/success', query: id ? { ad: id } : undefined })
}
</script>

<template>
  <PromotePanel v-if="draft.createdId" @skip="skip" />
</template>
