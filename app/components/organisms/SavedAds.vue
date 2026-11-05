<script setup lang="ts">
/** Список сохранённых объявлений: избранное или просмотренные (одна раскладка, разный источник) */
const props = defineProps<{ kind: 'favorites' | 'viewed' }>()

const favorites = useFavoritesStore()
const viewed = useViewedStore()

const isFav = computed(() => props.kind === 'favorites')
const store = computed(() => (isFav.value ? favorites : viewed))
const inCabinet = useInCabinet()
onMounted(() => store.value.load())

const title = computed(() => (isFav.value ? tr('Избранное') : inCabinet ? tr('История просмотров') : tr('Просмотренные')))
const emptyText = computed(() => (isFav.value
  ? tr('Здесь будут объявления, которые вы отметили сердечком.')
  : tr('Вы пока ничего не просматривали.')))
const status = computed(() => store.value.status)
// внутри кабинета: заголовок кабинета со стрелкой назад, без своего контейнера и отступов
const KContainerTag = resolveComponent('KContainer')
</script>

<template>
  <component :is="inCabinet ? 'section' : KContainerTag" v-bind="inCabinet ? {} : { as: 'section' }" class="saved" :class="{ 'saved--cabinet': inCabinet }">
    <CabinetPageHead v-if="inCabinet" :title="title">
      <KTextButton v-if="!isFav && viewed.items.length" size="sm" @click="viewed.clear()">{{ tr('Очистить') }}</KTextButton>
    </CabinetPageHead>
    <header v-else class="saved__head">
      <h1 id="saved-title" class="saved__title">{{ title }}</h1>
      <KTextButton v-if="!isFav && viewed.items.length" size="sm" @click="viewed.clear()">{{ tr('Очистить') }}</KTextButton>
    </header>

    <AdsFeed
      :items="store.items"
      :status="status"
      :empty-text="emptyText"
      @retry="store.load()"
    >
      <template #empty>
        <KButton to="/" variant="outline">{{ tr('Перейти к объявлениям') }}</KButton>
      </template>
    </AdsFeed>
  </component>
</template>

<style scoped>
.saved { display: flex; flex-direction: column; gap: 16px; padding-block: 16px 40px; }
.saved.saved--cabinet { padding-block: 0; }
/* в кабинете лента уже на ширину бокового меню: на 1380+ четыре колонки вместо пяти */
@media (min-width: 1380px) {
  .saved--cabinet :deep(.feed__grid:not(.feed__grid--list)) { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .saved--cabinet :deep(.feed__grid--list) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
.saved__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.saved__title { margin: 0; font-size: var(--text-22-24); line-height: var(--leading-22-24); font-weight: var(--font-weight-medium); }
@media (min-width: 1380px) {
  .saved { padding-block: 32px 64px; }
  .saved__title { font-size: 28px; line-height: 32px; }
}
</style>
