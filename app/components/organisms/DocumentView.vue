<script setup lang="ts">
const props = defineProps<{ slug: string }>()

const store = useDocumentsStore()
watch(() => props.slug, s => store.open(s), { immediate: true })

const doc = computed(() => (store.current?.slug === props.slug ? store.current : null))
useHead({ title: computed(() => `${tr(doc.value?.title ?? 'Документ')} - Kango`) })
</script>

<template>
  <KContainer as="article" class="dview">
    <template v-if="doc">
      <h1 class="dview__title">{{ tr(doc.title) }}</h1>
      <section v-for="(s, i) in doc.sections" :key="i" class="dview__section">
        <h2 class="dview__h2">{{ tr(s.title) }}</h2>
        <p class="dview__text">{{ tr(s.text) }}</p>
      </section>
    </template>
    <template v-else-if="store.status === 'error'">
      <h1 class="dview__title">{{ tr('Документ не найден') }}</h1>
      <p class="dview__text">{{ tr('Возможно, ссылка неверна.') }}</p>
      <KButton to="/documents" variant="outline">{{ tr('К списку документов') }}</KButton>
    </template>
    <p v-else class="dview__text" aria-busy="true">{{ tr('Загрузка...') }}</p>
  </KContainer>
</template>

<style scoped>
.dview { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; max-width: 720px; padding-block: 16px 40px; }
.dview__title { margin: 0; font-size: var(--text-22-24); line-height: var(--leading-22-24); font-weight: var(--font-weight-medium); }
.dview__section { display: flex; flex-direction: column; gap: 8px; }
.dview__h2 { margin: 0; font-size: var(--text-17-20); line-height: var(--leading-17-20); font-weight: var(--font-weight-medium); }
.dview__text { margin: 0; font-size: var(--text-16-20); line-height: 24px; white-space: pre-line; }
</style>
