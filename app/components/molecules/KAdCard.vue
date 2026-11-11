<script setup lang="ts">
import noPhoto from '~/assets/img/no-photo.webp'
const props = defineProps<{
  title: string
  price: string
  /** Город, район */
  location: string
  image?: string
  imageAlt?: string
  to?: string
  favorite?: boolean
  /** Горизонтальная карточка (фото слева): списки рядом с картой */
  compact?: boolean
  /** Нефиксированная цена («от», «в час»): оранжевая пилюля, фиксированная - мятная */
  variable?: boolean
}>()

defineEmits<{ 'toggle-favorite': [] }>()

const tag = computed(() => (props.to ? resolveComponent('NuxtLink') : 'div'))
const attrs = computed(() => (props.to ? { to: props.to } : {}))
</script>

<template>
  <article class="kad" :class="{ 'kad--compact': compact, 'kad--var': variable }">
    <div class="kad__media">
      <img class="kad__img" :class="{ 'kad__img--empty': !image }" :src="image || noPhoto" :alt="imageAlt ?? ''" loading="lazy">
      <span class="kad__price">{{ price }}</span>
      <KIconButton
        class="kad__fav"
        type="favorite"
        :label="favorite ? tr('Убрать из избранного') : tr('В избранное')"
        :selected="favorite"
        @click="$emit('toggle-favorite')"
      />
    </div>
    <component :is="tag" v-bind="attrs" class="kad__body">
      <span class="kad__title">{{ title }}</span>
      <span class="kad__location"><Icon name="kango:map-pin-16" size="16" class="kad__pin" />{{ trl(location) }}</span>
    </component>
  </article>
</template>

<style scoped>
.kad {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  border-radius: 24px;
  background: linear-gradient(180deg, #fdeee2, var(--color-fill-white) 75%);
  border: 1px solid color-mix(in srgb, var(--color-label-primary) 8%, transparent);
  color: var(--color-label-primary);
}
.kad__media { position: relative; aspect-ratio: 1.12 / 1; overflow: hidden; border-radius: 24px 24px 0 0; background: var(--color-fill-gray-3); }
.kad__img { display: block; width: 100%; height: 100%; object-fit: cover; }
.kad__img--empty { object-fit: contain; background: #fdf9f6; }
.kad .kad__fav { position: absolute; top: 8px; right: 8px; z-index: 2; border-radius: 50%; background: var(--color-fill-white); color: var(--color-fill-primary); }
.kad__price { position: absolute; left: 10px; bottom: 10px; z-index: 1; padding: 4px 12px; border-radius: 12px; background: #d9f1eb; box-shadow: 0 4px 12px color-mix(in srgb, var(--color-label-primary) 18%, transparent); color: var(--color-fill-color-3); font-size: 15px; line-height: 20px; font-weight: var(--font-weight-semibold); white-space: nowrap; }
.kad--var .kad__price { background: var(--color-fill-primary); color: #fff; }
.kad__body { display: flex; flex-direction: column; gap: 8px; padding: 14px; color: inherit; text-decoration: none; }
/* Вся карточка кликабельна: ссылка растянута на карточку */
.kad__body::after { content: ''; position: absolute; inset: 0; }
.kad__body:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: -2px; border-radius: 24px; }
.kad__title { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2; font-size: var(--text-15-16); line-height: 20px; font-weight: var(--font-weight-semibold); }
.kad__location { display: flex; align-items: center; gap: 6px; color: var(--color-label-secondary); font-size: var(--text-13-16); line-height: 16px; }
.kad__pin { flex: none; color: var(--color-fill-color-3); }

/* Горизонтальный вариант: фото слева, текст справа (список рядом с картой) */
.kad--compact { flex-direction: row; align-items: stretch; border-radius: 20px; }
.kad--compact .kad__media { flex: 0 0 132px; width: 132px; aspect-ratio: auto; min-height: 104px; border-radius: 20px 0 0 20px; }
.kad--compact .kad__body { flex: 1; min-width: 0; justify-content: center; gap: 6px; padding: 10px 12px; }
.kad--compact .kad__fav { top: 6px; right: auto; left: 6px; }
.kad--compact .kad__price { left: 6px; bottom: 6px; padding: 2px 8px; font-size: 13px; line-height: 18px; }
</style>
