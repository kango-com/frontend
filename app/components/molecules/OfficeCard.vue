<script setup lang="ts">
defineProps<{
  address: string
}>()
</script>

<template>
  <div class="office" role="img" :aria-label="`Карта: ${address}`">
    <Icon name="kango:map-pin-16" size="16" />
    <span>Карта появится после выбора провайдера</span>
  </div>
</template>

<style scoped>
.office { display: flex; align-items: center; justify-content: center; gap: 6px; height: 160px; border-radius: var(--radius-md); background: var(--color-fill-tint); color: var(--color-label-secondary); font-size: var(--text-14-16); text-align: center; padding: 12px; }
</style>
