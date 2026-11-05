<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: () => tr('Настройки - Kango') })
</script>

<template>
  <AccountSettings />
</template>
