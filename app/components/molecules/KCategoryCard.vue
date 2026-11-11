<script setup lang="ts">
import work from '~/assets/img/categories/work.webp'
import realEstate from '~/assets/img/categories/real-estate.webp'
import goods from '~/assets/img/categories/goods.webp'
import services from '~/assets/img/categories/services.webp'
import workCut from '~/assets/img/categories/work-cut.webp'
import realEstateCut from '~/assets/img/categories/real-estate-cut.webp'
import goodsCut from '~/assets/img/categories/goods-cut.webp'
import servicesCut from '~/assets/img/categories/services-cut.webp'

type Category = 'work' | 'real-estate' | 'goods' | 'services'

const props = defineProps<{
  category: Category
  title: string
  /** Подпись под названием, например «1 345 объявлений» */
  caption?: string
  /** Короткое пояснение под названием (только desktop) */
  hint?: string
  /** Значок слева от названия (только desktop) */
  icon?: string
  to?: string
}>()

const images: Record<Category, string> = { 'work': work, 'real-estate': realEstate, 'goods': goods, 'services': services }
const image = computed(() => images[props.category])
/** Вырезанные предметы без фона: на desktop стоят справа внизу карточки */
const cuts: Record<Category, string> = { 'work': workCut, 'real-estate': realEstateCut, 'goods': goodsCut, 'services': servicesCut }
const cut = computed(() => cuts[props.category])
const tag = computed(() => (props.to ? resolveComponent('NuxtLink') : 'div'))
const attrs = computed(() => (props.to ? { to: props.to } : {}))
</script>

<template>
  <component :is="tag" v-bind="attrs" class="kcat" :class="`kcat--${category}`" :style="{ backgroundImage: `url(${image})`, '--kcat-img': `url(${cut})` }">
    <span class="kcat__text">
      <span class="kcat__title"><Icon v-if="icon" :name="icon" size="28" class="kcat__icon" />{{ title }}</span>
      <span v-if="caption" class="kcat__caption">{{ caption }}</span>
      <span v-if="hint" class="kcat__hint">{{ hint }}</span>
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
  --kcat-base: #ffebdf;
  background-color: var(--kcat-base);
  background-position: center bottom;
  background-repeat: no-repeat;
  background-size: 100% auto;
  color: var(--color-label-primary);
  text-decoration: none;
}
/* Подложки совпадают с фоном иллюстраций */
.kcat--work { --kcat-accent: var(--color-fill-primary); }
.kcat--real-estate { --kcat-base: #ddf2ed; --kcat-accent: var(--color-fill-color-3); }
.kcat--goods { --kcat-base: #f1f3f5; --kcat-accent: var(--color-fill-color-3); }
.kcat--services { --kcat-base: #fff3e4; --kcat-accent: var(--color-fill-primary); }
.kcat__text { display: flex; flex-direction: column; gap: 4px; min-width: 0; padding: 4px 0 0 4px; }
.kcat__title {
  font-size: var(--text-17-20);
  line-height: var(--leading-17-20);
  font-weight: var(--font-weight-medium);
}
.kcat__caption {
  color: var(--color-label-secondary);
  font-size: var(--text-13-16);
  line-height: var(--leading-13-16);
}
.kcat__hint { display: none; color: var(--color-label-secondary); font-size: var(--text-13-16); line-height: var(--leading-13-16); }
.kcat__arrow {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-fill-white);
  box-shadow: 0 1px 4px color-mix(in srgb, var(--color-label-primary) 12%, transparent);
  color: var(--color-fill-primary);
  transition: transform 0.15s ease-out;
}
.kcat:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
@media (hover: hover) { a.kcat:hover .kcat__arrow { transform: translateX(2px); } }

@media (min-width: 768px) { .kcat { aspect-ratio: 175 / 154; } }
@media (min-width: 1380px) {
  /* картинка не на всю карточку, а справа внизу и растворяется в подложку: текст остаётся читаемым */
  .kcat { background-image: none !important; }
  .kcat::before {
    content: '';
    position: absolute;
    inset: auto auto 10px auto;
    inset-inline-end: 14px;
    width: 42%;
    height: 58%;
    background: var(--kcat-img) right bottom / contain no-repeat;
    filter: drop-shadow(0 6px 8px color-mix(in srgb, var(--color-label-primary) 14%, transparent));
    pointer-events: none;
  }
  .kcat__text, .kcat__arrow { position: relative; z-index: 1; }
  .kcat__title { display: flex; align-items: center; gap: 12px; }
  .kcat__icon { display: block; flex: none; color: var(--kcat-accent, var(--color-fill-primary)); }
  .kcat__hint { padding-inline-start: 0; }
  .kcat__arrow { color: var(--color-label-primary); }
}
@media (min-width: 1380px) { .kcat { aspect-ratio: 194 / 170; } }
</style>
