<script setup lang="ts">
definePageMeta({ layout: 'minimal', middleware: 'auth' })

const draft = useDraftAdStore()
const router = useRouter()
const route = useRoute()

/** `/new?edit=<id>`: правка своего объявления из кабинета той же формой */
const editId = computed(() => (typeof route.query.edit === 'string' ? route.query.edit : ''))
const editFailed = ref(false)
useHead({ title: () => (editId.value ? tr('Редактирование объявления - Kango') : tr('Подать объявление - Kango')) })

onMounted(async () => {
  if (editId.value) {
    editFailed.value = !(await draft.startEdit(editId.value))
    return
  }
  draft.restore()
  // объявление уже создано, осталось продвижение: повторная публикация дала бы дубль
  if (draft.createdId) router.replace('/new/promote')
})
// правка не должна остаться висеть в сторе после ухода со страницы
onBeforeUnmount(() => { if (draft.editingId) draft.reset() })

// после публикации уходим со страницы без предупреждения
const leaving = ref(false)
const dirty = computed(() => !leaving.value && draft.step === 'form' && !!(draft.draft.title || draft.draft.description || draft.draft.images?.length))
useLeaveGuard(dirty)

async function published() {
  leaving.value = true
  if (draft.editingId) {
    await router.push({ path: '/profile/ads', query: { saved: '1' } })
    return
  }
  await router.push('/new/promote')
}

async function back() {
  if (draft.editingId) {
    leaving.value = true
    await router.push('/profile/ads')
    return
  }
  draft.reset()
}
</script>

<template>
  <div v-if="editId && editFailed" class="newp__fail" role="alert">
    <p>{{ tr('Не удалось открыть объявление для редактирования.') }}</p>
    <KButton to="/profile/ads" variant="outline">{{ tr('К моим объявлениям') }}</KButton>
  </div>
  <p v-else-if="editId && !draft.editingId" class="newp__fail" aria-busy="true">{{ tr('Загрузка...') }}</p>
  <SectionPicker v-else-if="draft.step === 'section' || !draft.draft.section" @pick="draft.chooseSection" />
  <AdForm v-else @published="published" @back="back" />
</template>

<style scoped>
.newp__fail { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; max-width: 560px; margin: 0 auto; padding: 24px 16px; color: var(--color-label-secondary); }
.newp__fail p { margin: 0; }
</style>
