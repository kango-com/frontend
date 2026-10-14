<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'auth' })
useHead({ title: 'Избранное - Kango' })
</script>

<template>
  <SavedAds kind="favorites" />
</template>
