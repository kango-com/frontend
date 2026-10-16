<script setup lang="ts">
defineProps<{
  title: string
  lead?: string
  /** Внутри модального окна: без собственной рамки и отступов карточки */
  plain?: boolean
}>()
</script>

<template>
  <section class="acard" :class="{ 'acard--plain': plain }">
    <h1 class="acard__title">{{ title }}</h1>
    <p v-if="lead" class="acard__lead">{{ lead }}</p>
    <slot />
  </section>
</template>

<style scoped>
.acard { display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 400px; margin-inline: auto; padding: 24px 16px 40px; }
.acard__title { margin: 0; color: var(--color-label-primary); font-size: var(--text-22-24); line-height: var(--leading-22-24); font-weight: var(--font-weight-medium); }
.acard__lead { margin: -8px 0 0; color: var(--color-label-secondary); font-size: var(--text-16-20); line-height: var(--leading-16-20); }
/* 768+: карточка по центру (assumption, макет только 375) */
@media (min-width: 768px) {
  .acard { margin-block: 32px; padding: 32px; border: var(--border-width) solid var(--color-stroke-gray); border-radius: var(--radius-md); }
}
.acard.acard--plain { gap: 20px; max-width: none; margin: 0; padding: 12px 0 0; border: 0; border-radius: 0; text-align: center; }
.acard--plain .acard__title { font-size: 26px; line-height: 30px; }
.acard--plain .acard__lead { margin: -12px 0 0; }
</style>
