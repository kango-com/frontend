<script setup lang="ts">
const props = defineProps<{
  title: string
  price: string
  /** Теги через « • » («Дневные смены • Без опыта») */
  tags?: string[]
  /** Работодатель или примечание («Выезд на дом») */
  note?: string
  location: string
  published?: string
  to: string
  /** Подпись кнопки справа («Откликнуться», «Связаться») */
  action?: string
}>()

const tagsLine = computed(() => props.tags?.join(' • '))
</script>

<template>
  <article class="arc">
    <div class="arc__body">
      <h3 class="arc__title"><NuxtLink :to="to" class="arc__link">{{ title }}</NuxtLink></h3>
      <p class="arc__price">{{ price }}</p>
      <p v-if="tagsLine" class="arc__tags">{{ tagsLine }}</p>
      <p v-if="note" class="arc__note">{{ note }}</p>
      <p class="arc__meta">{{ location }}<template v-if="published"> · {{ published }}</template></p>
    </div>
    <KButton v-if="action" class="arc__action" variant="secondary" size="sm" :to="to">{{ action }}</KButton>
  </article>
</template>

<style scoped>
.arc {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border: var(--border-width) solid var(--color-stroke-gray);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-label-primary);
}
.arc__body { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.arc__body p, .arc__title { margin: 0; }
.arc__title { font-size: var(--text-17-20); line-height: var(--leading-17-20); font-weight: var(--font-weight-medium); overflow-wrap: anywhere; }
/* Вся карточка кликабельна через заголовок */
.arc .arc__link { color: inherit; text-decoration: none; }
.arc .arc__link::after { content: ''; position: absolute; inset: 0; border-radius: var(--radius-md); }
.arc .arc__link:focus-visible { outline: none; }
.arc:has(.arc__link:focus-visible) { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
.arc__price { font-size: var(--text-16-20); line-height: var(--leading-16-20); font-weight: var(--font-weight-medium); }
.arc__tags, .arc__note { color: var(--color-label-secondary); font-size: var(--text-14-16); line-height: var(--leading-14-16); }
.arc__meta { color: var(--color-label-gray); font-size: var(--text-12-16); line-height: var(--leading-12-16); }
.arc .arc__action { position: relative; z-index: 1; align-self: flex-start; }
@media (hover: hover) {
  .arc:hover { border-color: var(--color-stroke-primary); }
}
</style>
