<script setup lang="ts">
defineProps<{ label: string; width?: string }>()
</script>

<template>
  <div class="item" :style="width ? { width } : undefined">
    <div class="box"><slot /></div>
    <span class="label">{{ label }}</span>
  </div>
</template>

<style scoped>
.item { display: flex; flex-direction: column; gap: 8px; max-width: 100%; }
.box { display: flex; align-items: center; }
.label { font-size: var(--text-12-12); line-height: var(--leading-12-12); color: var(--color-label-gray); }
</style>
