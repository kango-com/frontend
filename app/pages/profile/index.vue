<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: () => tr('Профиль - Kango') })
</script>

<template>
  <CabinetHome />
</template>
