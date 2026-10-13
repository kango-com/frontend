<script setup lang="ts">
const props = defineProps<{
  title: string
  price: string
  /** Город, район */
  location: string
  image?: string
  imageAlt?: string
  to?: string
  favorite?: boolean
}>()

defineEmits<{ 'toggle-favorite': [] }>()

const tag = computed(() => (props.to ? resolveComponent('NuxtLink') : 'div'))
const attrs = computed(() => (props.to ? { to: props.to } : {}))
</script>

<template>
  <article class="kad">
    <div class="kad__media">
      <img v-if="image" class="kad__img" :src="image" :alt="imageAlt ?? ''" loading="lazy">
      <KIconButton
        class="kad__fav"
        type="favorite"
        :label="favorite ? 'Убрать из избранного' : 'В избранное'"
        :selected="favorite"
        @click="$emit('toggle-favorite')"
      />
    </div>
    <component :is="tag" v-bind="attrs" class="kad__body">
      <span class="kad__title">{{ title }}</span>
      <span class="kad__price">{{ price }}</span>
      <span class="kad__location">{{ location }}</span>
    </component>
  </article>
</template>

<style scoped>
.kad {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  overflow: hidden;
  border: var(--border-width) solid var(--color-stroke-gray);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-label-primary);
}
.kad__media {
  position: relative;
  height: 128px;
  overflow: hidden;
  background: var(--color-fill-gray-3);
}
.kad__img { display: block; width: 100%; height: 100%; object-fit: cover; }
.kad .kad__fav { position: absolute; top: 4px; right: 4px; z-index: 1; }
.kad__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 15px 8px;
  color: inherit;
  text-decoration: none;
}
/* Вся карточка кликабельна: ссылка растянута на карточку */
.kad__body::after { content: ''; position: absolute; inset: 0; }
.kad__body:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; border-radius: var(--radius-sm); }
.kad__title {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  font-size: var(--text-14-16);
  line-height: var(--leading-14-16);
}
.kad__price { font-size: var(--text-14-16); line-height: var(--leading-14-16); font-weight: var(--font-weight-semibold); }
.kad__location { color: var(--color-label-secondary); font-size: var(--text-10-12); line-height: var(--leading-10-12); }

/* Брейкпоинт desktop 1380px */
@media (min-width: 1380px) {
  .kad { border: 0; }
  .kad__media { height: auto; aspect-ratio: 246 / 244; }
  .kad__body { gap: 12px; padding: 21px 8px; }
  .kad__title,
  .kad__price { font-size: var(--text-15-16); line-height: var(--leading-15-16); }
  .kad__location { font-size: var(--text-12-12); line-height: var(--leading-12-12); }
}
</style>
