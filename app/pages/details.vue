<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: () => tr('Реквизиты - Kango') })
</script>

<template>
  <DocumentList group="details" :title="tr('Реквизиты')" />
</template>
