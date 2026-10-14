<script setup lang="ts">
const props = defineProps<{
  images: string[]
  /** Описание фото (заголовок объявления) */
  alt: string
  favorite?: boolean
}>()

defineEmits<{ 'toggle-favorite': [] }>()

const track = ref<HTMLElement>()
const index = ref(0)
const total = computed(() => props.images.length)

function onScroll() {
  const el = track.value
  if (el) index.value = Math.round(el.scrollLeft / el.clientWidth)
}
function go(i: number) {
  const el = track.value
  if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
}
const prev = () => go(Math.max(0, index.value - 1))
const next = () => go(Math.min(total.value - 1, index.value + 1))
</script>

<template>
  <div class="gal" role="region" aria-roledescription="карусель" :aria-label="`Фото: ${alt}`">
    <div ref="track" class="gal__track" tabindex="0" @scroll.passive="onScroll" @keydown.left.prevent="prev" @keydown.right.prevent="next">
      <img v-for="(src, i) in images" :key="src + i" class="gal__img" :src="src" :alt="`${alt}, фото ${i + 1}`" :loading="i ? 'lazy' : 'eager'">
      <div v-if="!images.length" class="gal__empty">Нет фото</div>
    </div>
    <span v-if="total" class="gal__counter" aria-live="polite">{{ index + 1 }} фото из {{ total }}</span>
    <KIconButton class="gal__fav" type="favorite" :label="favorite ? 'Убрать из избранного' : 'В избранное'" :selected="favorite" @click="$emit('toggle-favorite')" />
    <template v-if="total > 1">
      <KIconButton class="gal__nav gal__nav--prev" type="chevron-left" label="Предыдущее фото" :disabled="index === 0" @click="prev" />
      <KIconButton class="gal__nav gal__nav--next" type="chevron-right" label="Следующее фото" :disabled="index === total - 1" @click="next" />
    </template>
  </div>
</template>

<style scoped>
.gal { position: relative; overflow: hidden; border-radius: var(--radius-md); background: var(--color-fill-gray-3); }
.gal__track { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; outline: 0; }
.gal__track::-webkit-scrollbar { display: none; }
.gal__track:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: -2px; }
.gal__img, .gal__empty { flex: none; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; scroll-snap-align: center; }
.gal__empty { display: flex; align-items: center; justify-content: center; color: var(--color-label-gray); }
.gal__counter {
  position: absolute;
  left: 8px;
  bottom: 8px;
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--color-label-primary) 60%, transparent);
  color: var(--color-label-white);
  font-size: var(--text-12-16);
  line-height: var(--leading-12-16);
}
.gal .gal__fav { position: absolute; top: 8px; right: 8px; }
.gal .gal__nav { position: absolute; top: 50%; display: none; transform: translateY(-50%); background: var(--color-background); }
.gal .gal__nav--prev { left: 8px; }
.gal .gal__nav--next { right: 8px; }
@media (min-width: 768px) {
  .gal .gal__nav { display: inline-flex; }
  .gal__img, .gal__empty { aspect-ratio: 16 / 10; }
}
</style>
