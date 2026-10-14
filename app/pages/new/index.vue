<script setup lang="ts">
definePageMeta({ layout: 'minimal', middleware: 'auth' })
useHead({ title: 'Подать объявление - Kango' })

const draft = useDraftAdStore()
const router = useRouter()

onMounted(() => { if (draft.step === 'section' || draft.step === 'form') draft.restore() })
// после публикации уходим со страницы без предупреждения
const leaving = ref(false)
const dirty = computed(() => !leaving.value && draft.step === 'form' && !!(draft.draft.title || draft.draft.description || draft.draft.images?.length))
useLeaveGuard(dirty)

async function published() {
  leaving.value = true
  await router.push('/new/promote')
}
</script>

<template>
  <SectionPicker v-if="draft.step === 'section' || !draft.draft.section" @pick="draft.chooseSection" />
  <AdForm v-else @published="published" @back="draft.reset()" />
</template>
