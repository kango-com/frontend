<script setup lang="ts">
import kangaroo from '~/assets/img/hero/hero-kangaroo.webp'

// Фон обложки главной: фото с пляжем и кенгуру (одна картинка на всех ширинах).
// Слева и снизу растворяется в белый, чтобы заголовок и поиск читались; кенгуру остаётся справа.
</script>

<template>
  <div class="backdrop" :style="{ '--hero-kangaroo': `url(${kangaroo})` }" aria-hidden="true">
    <span class="backdrop__photo" />
  </div>
</template>

<style scoped>
.backdrop {
  position: absolute;
  inset: 0 0 auto 0;
  height: 280px;
  overflow: hidden;
  pointer-events: none;
}
/* Телефон: фото 3:1 сдвинуто так, чтобы кенгуру стоял у правого края, слева плавный переход в белый */
.backdrop__photo {
  position: absolute;
  top: 8px;
  right: -58px;
  width: 720px;
  height: 240px;
  background: var(--hero-kangaroo) center / 100% 100% no-repeat;
  -webkit-mask-image: linear-gradient(to right, transparent 0, transparent 22%, #000 52%), linear-gradient(to bottom, #000 66%, transparent 100%);
  mask-image: linear-gradient(to right, transparent 0, transparent 22%, #000 52%), linear-gradient(to bottom, #000 66%, transparent 100%);
  -webkit-mask-composite: source-in;
  mask-composite: intersect;
}

/* Планшет: фото крупнее, кенгуру правее центра */
@media (min-width: 768px) {
  .backdrop { height: 520px; }
  .backdrop__photo {
    top: 70px;
    right: -120px;
    width: 1050px;
    height: 350px;
    -webkit-mask-image: linear-gradient(to right, transparent 0, transparent 18%, #000 50%), linear-gradient(to bottom, #000 66%, transparent 100%);
    mask-image: linear-gradient(to right, transparent 0, transparent 18%, #000 50%), linear-gradient(to bottom, #000 66%, transparent 100%);
  }
}

/* Desktop: фото в рамке контента, справа у края контента, слева и снизу растворяется в фон, как в макете */
@media (min-width: 1380px) {
  .backdrop { height: 470px; overflow: visible; }
  .backdrop__photo {
    top: 70px;
    right: max(0px, calc(50% - 720px));
    width: 1130px;
    max-width: 100%;
    height: 377px;
    background-position: right top;
    /* слева, справа и снизу фото растворяется в белый */
    -webkit-mask-image: linear-gradient(to right, transparent 0, transparent 8%, #000 46%, #000 90%, transparent 100%), linear-gradient(to bottom, #000 58%, transparent 100%);
    mask-image: linear-gradient(to right, transparent 0, transparent 8%, #000 46%, #000 90%, transparent 100%), linear-gradient(to bottom, #000 58%, transparent 100%);
  }
  /* мягкая дымка поверх левой половины фото, как в макете */
  .backdrop__photo::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to right, color-mix(in srgb, var(--color-page) 70%, transparent) 10%, transparent 62%); }
}
</style>
