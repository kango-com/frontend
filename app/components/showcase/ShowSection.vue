<script setup lang="ts">
defineProps<{ title: string; note?: string }>()
</script>

<template>
  <section class="section">
    <h2>{{ title }}</h2>
    <p v-if="note" class="note">{{ note }}</p>
    <div class="items">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.section { margin-top: 32px; }
h2 { margin: 0 0 4px; color: var(--color-label-primary); font-size: 18px; line-height: 24px; }
.note { margin: 0 0 12px; font-size: var(--text-14-16); line-height: 20px; }
.items { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 16px 24px; margin-top: 12px; }
</style>
