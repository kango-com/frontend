<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  /** Номер задачи, в которой страница будет реализована */
  task?: string
}>()
</script>

<template>
  <KContainer as="section" class="placeholder">
    <h1>{{ title }}</h1>
    <p v-if="description">{{ description }}</p>
    <p v-if="task" class="task">Страница в разработке, задача {{ task }}.</p>
    <KButton to="/" variant="outline">На главную</KButton>
  </KContainer>
</template>

<style scoped>
.placeholder { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; padding-block: 32px 48px; }
h1 { margin: 0; color: var(--color-label-primary); font-size: var(--text-28-28); line-height: var(--leading-28-28); font-weight: var(--font-weight-medium); }
p { margin: 0; color: var(--color-label-secondary); font-size: var(--text-16-20); line-height: var(--leading-16-20); }
.task { color: var(--color-label-gray); font-size: var(--text-14-16); line-height: var(--leading-14-16); }
</style>
