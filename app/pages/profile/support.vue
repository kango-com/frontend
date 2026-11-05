<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: () => tr('Поддержка - Kango') })
</script>

<template>
  <CabinetSupport />
</template>
