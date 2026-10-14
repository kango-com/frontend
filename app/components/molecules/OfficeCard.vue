<script setup lang="ts">
defineProps<{
  address: string
  /** Часы работы */
  hours?: string
}>()
</script>

<template>
  <div class="office">
    <div class="office__map" role="img" :aria-label="`Карта: ${address}`">
      <Icon name="kango:map-pin-16" size="16" />
      <span>Карта появится позже</span>
    </div>
    <p class="office__address">{{ address }}</p>
    <p v-if="hours" class="office__hours">{{ hours }}</p>
  </div>
</template>

<style scoped>
.office { display: flex; flex-direction: column; gap: 8px; }
.office__map { display: flex; align-items: center; justify-content: center; gap: 6px; height: 160px; border-radius: var(--radius-md); background: var(--color-fill-tint); color: var(--color-label-secondary); font-size: var(--text-14-16); }
.office__address { margin: 0; font-size: var(--text-16-20); line-height: var(--leading-16-20); }
.office__hours { margin: 0; color: var(--color-label-secondary); font-size: var(--text-14-16); }
</style>
