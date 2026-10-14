<script setup lang="ts">
import mobile from '~/assets/img/hero/hero-mobile.webp'
import desktop from '~/assets/img/hero/hero-desktop.webp'

// Фон обложки главной: картинка, градиент в белый снизу и размытое белое пятно слева (как в макете).
// Картинка для 375 и 768 одна, для desktop другая.
</script>

<template>
  <div class="backdrop" :style="{ '--hero-mobile': `url(${mobile})`, '--hero-desktop': `url(${desktop})` }" aria-hidden="true">
    <span class="backdrop__glow" />
  </div>
</template>

<style scoped>
.backdrop {
  position: absolute;
  inset: 0 0 auto 0;
  height: 250px;
  overflow: hidden;
  background: var(--hero-mobile) center right / cover no-repeat;
  pointer-events: none;
}
/* Градиент в белый у нижнего края */
.backdrop::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 93%, var(--color-background) 100%);
}
/* Белое размытое пятно слева делает текст читаемым */
.backdrop__glow {
  position: absolute;
  top: -61px;
  left: -292px;
  width: 489px;
  height: 381px;
  border-radius: 50%;
  background: var(--color-background);
  filter: blur(45px);
}

/* Планшет: баннер на всю высоту обложки */
@media (min-width: 768px) {
  .backdrop { height: 520px; background-position: center right; }
}

/* Desktop: баннер справа до края окна, начинается в 509px от левого края контента, под шапкой */
@media (min-width: 1380px) {
  .backdrop {
    inset: 0 0 auto auto;
    left: calc(50% - 640px + 509px);
    height: 413px;
    background: var(--hero-desktop) center / cover no-repeat;
  }
  /* Левый и нижний край баннера плавно растворяются в белом (без жёсткой границы) */
  .backdrop {
    -webkit-mask-image: linear-gradient(to right, transparent 0, #000 280px), linear-gradient(to bottom, #000 78%, transparent 94%);
    -webkit-mask-composite: source-in;
    mask-image: linear-gradient(to right, transparent 0, #000 280px), linear-gradient(to bottom, #000 78%, transparent 94%);
    mask-composite: intersect;
  }
  .backdrop::after,
  .backdrop__glow { display: none; }
}
</style>
