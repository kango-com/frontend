<script setup lang="ts">
// Родительский маршрут кабинета: общая оболочка (боковое меню на 1380+), страницы - в app/pages/profile/
definePageMeta({ layout: 'default', middleware: 'auth' })
</script>

<template>
  <CabinetShell>
    <NuxtPage />
  </CabinetShell>
</template>
