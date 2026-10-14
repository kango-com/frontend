<script setup lang="ts">
definePageMeta({ layout: 'minimal', middleware: 'auth' })
useHead({ title: () => tr('Подать объявление - Kango') })

const draft = useDraftAdStore()
const router = useRouter()

onMounted(() => {
  draft.restore()
  // объявление уже создано, осталось продвижение: повторная публикация дала бы дубль
  if (draft.createdId) router.replace('/new/promote')
})
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
