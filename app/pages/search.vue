<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const q = computed(() => (typeof route.query.q === 'string' ? route.query.q.trim() : ''))
useHead({ title: 'Поиск - Kango' })
</script>

<template>
  <!-- Без запроса: экран поиска (задача 0027). С запросом: результаты в обычном шаблоне -->
  <NuxtLayout :name="q ? 'default' : 'search'">
    <ListingPage v-if="q" />
    <SearchPanel v-else />
  </NuxtLayout>
</template>
