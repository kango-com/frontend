<script setup lang="ts">
const items = [
  { icon: 'kango:check-20', title: 'Проверенные объявления' },
  { icon: 'kango:star-20', title: 'Быстрая публикация' },
  { icon: 'kango:message-24', title: 'Прямой контакт с автором' },
  { icon: 'kango:map-pin-16', title: 'По всему Израилю' }
]
</script>

<template>
  <ul class="feat">
    <li v-for="i in items" :key="i.title" class="feat__item">
      <Icon :name="i.icon" size="28" class="feat__icon" />
      <span class="feat__text">{{ tr(i.title) }}</span>
    </li>
  </ul>
</template>

<style scoped>
.feat { display: none; margin: 0; padding: 0; list-style: none; }
@media (min-width: 1380px) {
  .feat { display: grid; grid-template-columns: repeat(4, 1fr); padding-block: 24px 8px; }
  .feat__item { display: flex; align-items: center; justify-content: center; gap: 12px; padding-inline: 16px; }
  .feat__item + .feat__item { border-inline-start: 1px solid color-mix(in srgb, var(--color-label-primary) 12%, transparent); }
  .feat__icon { flex: none; color: var(--color-fill-color-3); }
  .feat__text { max-width: 150px; color: var(--color-label-primary); font-size: var(--text-15-16); line-height: 18px; font-weight: var(--font-weight-medium); }
}
</style>
