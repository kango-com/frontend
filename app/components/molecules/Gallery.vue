<script setup lang="ts">
import noPhoto from '~/assets/img/no-photo.webp'
const props = defineProps<{
  images: string[]
  /** Описание фото (заголовок объявления) */
  alt: string
  favorite?: boolean
  /** Не показывать сердечко на фото (оно стоит рядом с ценой) */
  noFavorite?: boolean
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
  <div class="gal" role="region" :aria-roledescription="tr('карусель')" :aria-label="tr('Фото: {alt}', { alt })">
    <div ref="track" class="gal__track" tabindex="0" @scroll.passive="onScroll" @keydown.left.prevent="prev" @keydown.right.prevent="next">
      <img v-for="(src, i) in images" :key="src + i" class="gal__img" :src="src" :alt="tr('{alt}, фото {n}', { alt, n: i + 1 })" :loading="i ? 'lazy' : 'eager'">
      <img v-if="!images.length" class="gal__img gal__img--empty" :src="noPhoto" :alt="tr('Нет фото')">
    </div>
    <span v-if="total" class="gal__counter" aria-live="polite"><Icon name="kango:camera-16" size="16" />{{ index + 1 }} {{ tr('фото из') }} {{ total }}</span>
    <KIconButton v-if="!noFavorite" class="gal__fav" type="favorite" :label="favorite ? tr('Убрать из избранного') : tr('В избранное')" :selected="favorite" @click="$emit('toggle-favorite')" />
    <template v-if="total > 1">
      <KIconButton class="gal__nav gal__nav--prev" type="chevron-left" :label="tr('Предыдущее фото')" :disabled="index === 0" @click="prev" />
      <KIconButton class="gal__nav gal__nav--next" type="chevron-right" :label="tr('Следующее фото')" :disabled="index === total - 1" @click="next" />
    </template>
  </div>
</template>

<style scoped>
.gal { position: relative; overflow: hidden; border-radius: 24px; background: var(--color-fill-gray-3); }
.gal__track { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; outline: 0; }
.gal__track::-webkit-scrollbar { display: none; }
.gal__track:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: -2px; }
.gal__img, .gal__empty { flex: none; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; scroll-snap-align: center; }
.gal__img--empty { object-fit: contain; background: #fdf9f6; }
.gal__empty { display: flex; align-items: center; justify-content: center; color: var(--color-label-gray); }
.gal__counter {
  position: absolute;
  left: 12px;
  bottom: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--color-label-primary) 60%, transparent);
  color: var(--color-label-white);
  font-size: var(--text-12-16);
  line-height: var(--leading-12-16);
}
.gal .gal__fav { position: absolute; top: 8px; right: 8px; }
.gal .gal__nav { position: absolute; top: 50%; display: none; transform: translateY(-50%); border-radius: 50%; background: var(--color-background); box-shadow: 0 2px 8px color-mix(in srgb, var(--color-label-primary) 18%, transparent); }
.gal .gal__nav--prev { left: 14px; }
.gal .gal__nav--next { right: 14px; }
@media (min-width: 768px) {
  .gal .gal__nav { display: inline-flex; }
  .gal__img, .gal__empty { aspect-ratio: 16 / 10; }
}
</style>
