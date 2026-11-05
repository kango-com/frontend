<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: () => tr('Мои объявления - Kango') })
</script>

<template>
  <MyAdsView />
</template>
