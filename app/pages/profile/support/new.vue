<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: () => tr('Новое обращение - Kango') })
</script>

<template>
  <TicketForm />
</template>
