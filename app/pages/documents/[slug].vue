<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
</script>

<template>
  <DocumentView :slug="String(route.params.slug)" />
</template>
