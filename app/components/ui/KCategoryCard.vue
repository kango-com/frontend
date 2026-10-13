<script setup lang="ts">
import work from '~/assets/img/categories/work.webp'
import realEstate from '~/assets/img/categories/real-estate.webp'
import goods from '~/assets/img/categories/goods.webp'
import services from '~/assets/img/categories/services.webp'

type Category = 'work' | 'real-estate' | 'goods' | 'services'

const props = defineProps<{
  category: Category
  title: string
  /** Подпись под названием, например «1 345 объявлений» */
  caption?: string
  to?: string
}>()

const images: Record<Category, string> = { 'work': work, 'real-estate': realEstate, 'goods': goods, 'services': services }
const image = computed(() => images[props.category])
const tag = computed(() => (props.to ? resolveComponent('NuxtLink') : 'div'))
const attrs = computed(() => (props.to ? { to: props.to } : {}))
</script>

<template>
  <component :is="tag" v-bind="attrs" class="kcat" :class="`kcat--${category}`" :style="{ backgroundImage: `url(${image})` }">
    <span class="kcat__text">
      <span class="kcat__title">{{ title }}</span>
      <span v-if="caption" class="kcat__caption">{{ caption }}</span>
    </span>
    <span v-if="to" class="kcat__arrow" aria-hidden="true">
      <Icon name="kango:chevron-right-sm-24" size="24" />
    </span>
  </component>
</template>

<style scoped>
.kcat {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2px;
  width: 100%;
  aspect-ratio: 168 / 150;
  padding: 8px;
  overflow: hidden;
  border-radius: var(--radius-md);
  background-color: #f7ebdf;
  background-position: center bottom;
  background-repeat: no-repeat;
  background-size: 100% auto;
  color: var(--color-label-primary);
  text-decoration: none;
}
/* Подложки совпадают с фоном иллюстраций */
.kcat--real-estate { background-color: var(--color-fill-tint); }
.kcat--goods { background-color: #e7f1f0; }
.kcat--services { background-color: #eeecf7; }
.kcat__text { display: flex; flex-direction: column; gap: 4px; min-width: 0; padding: 4px; }
.kcat__title {
  font-size: var(--text-16-16);
  line-height: var(--leading-16-16);
  font-weight: var(--font-weight-medium);
}
.kcat__caption {
  color: var(--color-fill-gray);
  font-size: var(--text-12-12);
  line-height: var(--leading-12-12);
}
.kcat__arrow {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-fill-white);
  color: var(--color-fill-primary);
  transition: transform 0.15s ease-out;
}
.kcat:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
@media (hover: hover) { a.kcat:hover .kcat__arrow { transform: translateX(2px); } }

@media (min-width: 768px) { .kcat { aspect-ratio: 175 / 154; } }
@media (min-width: 1380px) { .kcat { aspect-ratio: 194 / 170; } }
</style>
