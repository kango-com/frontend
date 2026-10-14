<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'auth' })
useHead({ title: () => tr('Избранное - Kango') })
</script>

<template>
  <SavedAds kind="favorites" />
</template>
