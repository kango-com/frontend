<script setup lang="ts">
withDefaults(defineProps<{
  /** Тег корневого элемента */
  as?: string
}>(), { as: 'div' })
</script>

<template>
  <component :is="as" class="kcontainer">
    <slot />
  </component>
</template>

<style scoped>
/* Отступ по краям 16px (375, 768), 50px (1380 и шире), контент центрируется и не шире 1280px */
.kcontainer {
  width: 100%;
  max-width: 1380px;
  margin: 0 auto;
  padding-inline: var(--spacing-gutter);
}
@media (min-width: 1380px) {
  .kcontainer { padding-inline: 50px; }
}
</style>
