<script setup lang="ts">
/** Список сохранённых объявлений: избранное или просмотренные (одна раскладка, разный источник) */
const props = defineProps<{ kind: 'favorites' | 'viewed' }>()

const favorites = useFavoritesStore()
const viewed = useViewedStore()

const isFav = computed(() => props.kind === 'favorites')
const store = computed(() => (isFav.value ? favorites : viewed))
onMounted(() => store.value.load())

const title = computed(() => (isFav.value ? 'Избранное' : 'Просмотренные'))
const emptyText = computed(() => (isFav.value
  ? 'Здесь будут объявления, которые вы отметили сердечком.'
  : 'Вы пока ничего не просматривали.'))
const status = computed(() => store.value.status)
</script>

<template>
  <KContainer as="section" class="saved" aria-labelledby="saved-title">
    <header class="saved__head">
      <h1 id="saved-title" class="saved__title">{{ title }}</h1>
      <KTextButton v-if="!isFav && viewed.items.length" size="sm" @click="viewed.clear()">Очистить</KTextButton>
    </header>

    <AdsFeed
      :items="store.items"
      :status="status"
      :empty-text="emptyText"
      @retry="store.load()"
    >
      <template #empty>
        <KButton to="/" variant="outline">Перейти к объявлениям</KButton>
      </template>
    </AdsFeed>
  </KContainer>
</template>

<style scoped>
.saved { display: flex; flex-direction: column; gap: 16px; padding-block: 16px 40px; }
.saved__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.saved__title { margin: 0; font-size: var(--text-22-24); line-height: var(--leading-22-24); font-weight: var(--font-weight-medium); }
@media (min-width: 1380px) {
  .saved { padding-block: 32px 64px; }
  .saved__title { font-size: 28px; line-height: 32px; }
}
</style>
