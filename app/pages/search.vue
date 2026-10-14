<script setup lang="ts">
// на мобильном у результатов своя верхняя панель, общая шапка скрыта
definePageMeta({ layout: false, hideHeaderMobile: true })

const route = useRoute()
const q = computed(() => (typeof route.query.q === 'string' ? route.query.q.trim() : ''))
useHead({ title: () => tr('Поиск - Kango') })
</script>

<template>
  <!-- Без запроса: экран поиска (задача 0027). С запросом: результаты в обычном шаблоне -->
  <NuxtLayout :name="q ? 'default' : 'search'">
    <ListingPage v-if="q" />
    <SearchPanel v-else />
  </NuxtLayout>
</template>
