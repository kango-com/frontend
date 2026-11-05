<script setup lang="ts">
// Старый адрес карты: карта теперь - вид выдачи недвижимости (Договор, Прил. 1, п. 9)
definePageMeta({ layout: 'default' })
await navigateTo({ path: '/realty', query: { view: 'map' } }, { replace: true })
</script>

<template>
  <div />
</template>
