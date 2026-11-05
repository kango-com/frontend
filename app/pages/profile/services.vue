<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: () => tr('Платные услуги - Kango') })
</script>

<template>
  <PaidServicesView />
</template>
