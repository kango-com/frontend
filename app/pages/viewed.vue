<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: () => tr('Просмотренные - Kango') })
</script>

<template>
  <SavedAds kind="viewed" />
</template>
