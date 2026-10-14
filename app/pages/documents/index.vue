<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: () => tr('Документы - Kango') })
</script>

<template>
  <DocumentList group="documents" :title="tr('Документы')" />
</template>
