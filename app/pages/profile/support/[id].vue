<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: () => tr('Обращение - Kango') })
const route = useRoute()
</script>

<template>
  <TicketView :id="String(route.params.id)" />
</template>
