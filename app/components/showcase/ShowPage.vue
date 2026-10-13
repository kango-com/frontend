<script setup lang="ts">
defineProps<{ title: string; hint?: string; wide?: boolean }>()
</script>

<template>
  <main class="page" :class="{ 'page--wide': wide }">
    <NuxtLink to="/components" class="back">Все компоненты</NuxtLink>
    <h1>{{ title }}</h1>
    <p v-if="hint" class="hint">{{ hint }}</p>
    <slot />
  </main>
</template>

<style scoped>
.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 16px 64px;
  color: var(--color-fill-gray);
}
.page--wide { max-width: 1440px; }
.back {
  display: inline-block;
  margin-bottom: 8px;
  color: var(--color-fill-color-3);
  font-size: var(--text-14-16);
  line-height: var(--leading-14-16);
}
h1 { margin: 0 0 8px; color: var(--color-label-primary); font-size: 32px; line-height: 40px; }
.hint { margin: 0 0 8px; line-height: 24px; }
</style>
