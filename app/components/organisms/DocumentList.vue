<script setup lang="ts">
const props = defineProps<{
  group: 'documents' | 'details'
  title: string
}>()

const store = useDocumentsStore()
onMounted(() => store.load())

const items = computed(() => (props.group === 'documents' ? store.documents : store.details))
</script>

<template>
  <KContainer as="section" class="dlist" aria-labelledby="dlist-title">
    <h1 id="dlist-title" class="dlist__title">{{ title }}</h1>
    <p v-if="store.status === 'error'" class="dlist__note" role="alert">
      Не удалось загрузить список. <KTextButton size="sm" @click="store.list = []; store.load()">Повторить</KTextButton>
    </p>
    <ul v-else-if="items.length" class="dlist__list">
      <li v-for="d in items" :key="d.slug"><KTableRow type="chevron" :label="d.title" :to="`/documents/${d.slug}`" /></li>
    </ul>
    <p v-else-if="store.status === 'success'" class="dlist__note">Пока здесь ничего нет.</p>
    <p v-else class="dlist__note" aria-busy="true">Загрузка...</p>
  </KContainer>
</template>

<style scoped>
.dlist { display: flex; flex-direction: column; gap: 12px; max-width: 720px; padding-block: 16px 40px; }
.dlist__title { margin: 0; font-size: var(--text-22-24); line-height: var(--leading-22-24); font-weight: var(--font-weight-medium); }
.dlist__list { margin: 0; padding: 0; list-style: none; }
.dlist__note { margin: 0; color: var(--color-label-secondary); }
</style>
