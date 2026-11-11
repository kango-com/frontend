<script setup lang="ts">
import type { Section } from '~/types'
import noPhoto from '~/assets/img/no-photo.webp'

const props = defineProps<{
  section: Section
  title: string
  price: string
  location: string
  published: string
  image?: string
  to: string
  favorite?: boolean
  /** Нефиксированная цена («от», «в час», «в месяц»): оранжевая пилюля, фиксированная - мятная */
  variable?: boolean
}>()
defineEmits<{ 'toggle-favorite': [] }>()

const META: Record<Section, { label: string, icon: string }> = {
  work: { label: 'Работа', icon: 'kango:briefcase-24' },
  realty: { label: 'Недвижимость', icon: 'kango:home-24' },
  goods: { label: 'Товары', icon: 'kango:bag-24' },
  services: { label: 'Услуги', icon: 'kango:wrench-24' }
}
const meta = computed(() => META[props.section])
// знак ₪ рисуем системным шрифтом: в Onest глифа ₪ нет
const priceParts = computed(() => {
  const i = props.price.indexOf('₪')
  return i < 0 ? { before: props.price, after: '' } : { before: props.price.slice(0, i), after: props.price.slice(i + 1) }
})
</script>

<template>
  <article class="fad" :class="[`fad--${section}`, { 'fad--var': variable }]">
    <div class="fad__media">
      <img class="fad__img" :class="{ 'fad__img--empty': !image }" :src="image || noPhoto" alt="" loading="lazy">
      <span class="fad__tag" role="img" :aria-label="tr(meta.label)" :title="tr(meta.label)"><img :src="sectionIcon(section)" class="fad__tagpic" alt="" width="28" height="28"></span>
      <span class="fad__price">{{ priceParts.before }}<span v-if="price.includes('₪')" class="fad__cur">₪</span>{{ priceParts.after }}</span>
      <KIconButton class="fad__fav" type="favorite" :label="favorite ? tr('Убрать из избранного') : tr('В избранное')" :selected="favorite" @click="$emit('toggle-favorite')" />
    </div>
    <NuxtLink :to="to" class="fad__body">
      <span class="fad__title">{{ title }}</span>
      <span class="fad__row"><Icon name="kango:map-pin-16" size="18" class="fad__pin" /><span class="fad__ell">{{ trl(location) }}</span></span>
      <span class="fad__row fad__row--time"><Icon name="kango:clock-16" size="18" />{{ published }}</span>
    </NuxtLink>
  </article>
</template>

<style scoped>
.fad {
  --fad-bg: #fdeee2;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border-radius: 24px;
  background: linear-gradient(180deg, var(--fad-bg), var(--color-fill-white) 75%);
  border: 1px solid color-mix(in srgb, var(--color-label-primary) 8%, transparent);
  color: var(--color-label-primary);
}
.fad--services { --fad-bg: #dff2ee; }
.fad--work { --fad-bg: #fdeee2; }
.fad--goods { --fad-bg: #ece9f8; }
.fad__media { position: relative; aspect-ratio: 1.12 / 1; overflow: hidden; border-radius: 24px 24px 0 0; background: var(--color-fill-gray-3); }
.fad__img { display: block; width: 100%; height: 100%; object-fit: cover; }
.fad__img--empty { object-fit: contain; background: #fdf9f6; }
.fad__tag { position: absolute; top: 12px; left: 12px; display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; background: #fff3ea; }
.fad__tagpic { display: block; flex: none; width: 28px; height: 28px; object-fit: contain; }
.fad--services .fad__tag, .fad--work .fad__tag { background: #e3f4ef; }
.fad .fad__fav { position: absolute; top: 10px; right: 10px; width: 40px; height: 40px; z-index: 2; border-radius: 50%; background: var(--color-fill-white); color: var(--color-fill-primary); }
.fad__body { display: flex; flex: 1; flex-direction: column; gap: 12px; padding: 18px 20px 16px; color: inherit; text-decoration: none; }
.fad__body::after { content: ''; position: absolute; inset: 0; }
.fad__body:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: -2px; border-radius: 24px; }
.fad__title { display: -webkit-box; min-height: 44px; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2; font-size: 17px; line-height: 22px; font-weight: var(--font-weight-semibold); }
.fad__price { position: absolute; left: 12px; bottom: 12px; z-index: 1; padding: 6px 14px; border-radius: 14px; background: #d9f1eb; box-shadow: 0 4px 12px color-mix(in srgb, var(--color-label-primary) 18%, transparent); color: var(--color-fill-color-3); font-size: 18px; line-height: 22px; font-weight: var(--font-weight-semibold); white-space: nowrap; }
.fad--var .fad__price { background: var(--color-fill-primary); color: #fff; }
.fad__cur { display: inline-block; margin-inline-start: 1px; font-family: Arial, 'Segoe UI', sans-serif; font-size: 0.92em; font-weight: 700; }
.fad__row { display: flex; align-items: center; gap: 8px;  color: var(--color-label-primary); font-size: 14px; line-height: 18px; }
.fad__ell { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fad__pin { flex: none; color: var(--color-fill-color-3); }
.fad__row--time { color: var(--color-label-secondary); }
.fad__row--time :deep(svg) { flex: none; color: var(--color-label-gray); }
@media (max-width: 767px) {
  .fad { border-radius: 18px; }
  .fad__media { border-radius: 18px 18px 0 0; }
  .fad__tag { top: 8px; left: 8px; width: 34px; height: 34px; }
  .fad__tagpic { width: 22px; height: 22px; }
  .fad .fad__fav { top: 6px; right: 6px; width: 32px; height: 32px; }
  .fad__body { gap: 10px; padding: 12px; }
  .fad__title { min-height: 36px; font-size: 14px; line-height: 18px; }
  .fad__price { left: 8px; bottom: 8px; padding: 4px 10px; border-radius: 12px; font-size: 14px; line-height: 18px; }
  .fad__row { gap: 6px; font-size: 12px; line-height: 16px; }
}
</style>
