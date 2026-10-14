<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const q = computed(() => (typeof route.query.q === 'string' ? route.query.q.trim() : ''))
useHead({ title: computed(() => (q.value ? `${q.value} - поиск - Kango` : 'Поиск - Kango')) })
</script>

<template>
  <!-- Без запроса: экран поиска. С запросом: результаты (задача 0028) в обычном шаблоне -->
  <NuxtLayout :name="q ? 'default' : 'search'">
    <PagePlaceholder v-if="q" :title="`Результаты: ${q}`" description="Список найденных объявлений, сортировка и фильтры." task="0028" />
    <SearchPanel v-else />
  </NuxtLayout>
</template>
