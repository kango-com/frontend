<script setup lang="ts">
defineProps<{ title: string }>()
const id = useId()
</script>

<template>
  <fieldset class="fsec" :aria-labelledby="id">
    <legend :id="id" class="fsec__title">{{ title }}</legend>
    <div class="fsec__body"><slot /></div>
  </fieldset>
</template>

<style scoped>
.fsec { min-width: 0; margin: 0; padding: 0; border: 0; }
.fsec__title { padding: 0; margin-bottom: 12px; color: var(--color-label-primary); font-size: var(--text-17-20); line-height: var(--leading-17-20); font-weight: var(--font-weight-medium); }
.fsec__body { display: flex; flex-direction: column; gap: 16px; }
</style>
