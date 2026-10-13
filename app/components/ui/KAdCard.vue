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
  padding: 4px;
  border: var(--border-width) solid var(--color-stroke-gray);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-label-primary);
}
.kad__media {
  position: relative;
  height: 126px;
  overflow: hidden;
  border-radius: 8px;
  background: var(--color-fill-gray-3);
}
.kad__img { display: block; width: 100%; height: 100%; object-fit: cover; }
.kad__fav { position: absolute; top: 8px; right: 8px; }
.kad__body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 4px 4px;
  color: inherit;
  text-decoration: none;
}
.kad__body:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; border-radius: var(--radius-sm); }
.kad__title { font-size: var(--text-14-16); line-height: var(--leading-14-16); }
.kad__price { font-size: var(--text-14-16); line-height: var(--leading-14-16); font-weight: var(--font-weight-semibold); }
.kad__location { color: var(--color-label-secondary); font-size: var(--text-10-12); line-height: var(--leading-10-12); }

/* Брейкпоинт desktop 1380px */
@media (min-width: 1380px) {
  .kad__media { height: auto; aspect-ratio: 1; }
  .kad__body { gap: 6px; padding: 12px 8px 8px; }
  .kad__title,
  .kad__price { font-size: var(--text-15-16); line-height: var(--leading-15-16); }
  .kad__location { font-size: var(--text-12-12); line-height: var(--leading-12-12); }
}
</style>
