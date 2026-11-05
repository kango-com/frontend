<script setup lang="ts">
/** Заголовок страницы кабинета: на телефоне и планшете стрелка «назад» в кабинет, на 1380+ только заголовок (меню сбоку) */
defineProps<{ title: string, back?: string }>()
</script>

<template>
  <header class="cph">
    <NuxtLink :to="back ?? '/profile'" class="cph__back" :aria-label="tr('Назад в кабинет')">
      <Icon name="kango:arrow-left-24" size="24" />
    </NuxtLink>
    <h1 class="cph__title">{{ title }}</h1>
    <div v-if="$slots.default" class="cph__actions"><slot /></div>
  </header>
</template>

<style scoped>
.cph { display: flex; align-items: center; gap: 8px; min-height: 44px; }
.cph .cph__back { display: inline-flex; flex: none; align-items: center; justify-content: center; width: 44px; height: 44px; margin-inline-start: -10px; border-radius: var(--radius-md); color: var(--color-label-primary); }
[dir='rtl'] .cph__back { transform: scaleX(-1); }
.cph__back:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: -2px; }
.cph__title { flex: 1; min-width: 0; margin: 0; font-size: var(--text-22-24); line-height: var(--leading-22-24); font-weight: var(--font-weight-medium); }
.cph__actions { display: flex; flex: none; gap: 8px; }
@media (min-width: 1380px) {
  .cph__back { display: none !important; }
  .cph__title { font-size: 28px; line-height: 32px; }
}
</style>
