<script setup lang="ts">
import mobile from '~/assets/img/hero/hero-mobile.webp'
import desktop from '~/assets/img/hero/hero-desktop.webp'
import wide from '~/assets/img/hero/hero-desktop-wide.webp'

// Фон обложки главной: баннер с пляжем и кенгуру (одна картинка 1380x566 на всех ширинах),
// внизу плавно уходит в белое. На узких экранах кадрируется по кенгуру справа.
</script>

<template>
  <div class="backdrop" :style="{ '--hero-mobile': `url(${mobile})`, '--hero-desktop': `url(${desktop})`, '--hero-wide': `url(${wide})` }" aria-hidden="true">
    <span class="backdrop__glow" />
  </div>
</template>

<style scoped>
.backdrop {
  position: absolute;
  inset: 0 0 auto 0;
  height: 250px;
  overflow: hidden;
  background: var(--hero-mobile) 100% center / cover no-repeat;
  pointer-events: none;
}
/* Градиент в белый у нижнего края */
.backdrop::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 90%, var(--color-background) 100%);
}

/* Планшет: баннер на всю высоту обложки */
@media (min-width: 768px) {
  .backdrop { height: 520px; background-position: 78% center; }
}

/* Desktop: баннер на всю ширину окна под шапкой, высота как у исходной картинки */
@media (min-width: 1380px) {
  .backdrop { height: 566px; background: var(--hero-desktop) center top / cover no-repeat; }
  .backdrop::after { background: linear-gradient(to bottom, transparent 90%, var(--color-background) 100%); }
}

/* Wide 1920: баннер справа до края окна (509px от левого края контента), белое размытое пятно слева, как в макете */
.backdrop__glow { display: none; }
@media (min-width: 1920px) {
  .backdrop {
    inset: 0 0 auto auto;
    left: calc(50% - 640px + 509px);
    height: 413px;
    background: var(--hero-wide) center / cover no-repeat;
  }
  .backdrop::after { background: linear-gradient(to bottom, transparent 81%, var(--color-background) 92%); }
  .backdrop__glow {
    display: block;
    position: absolute;
    top: -61px;
    left: -447px;
    width: 928px;
    height: 486px;
    border-radius: 50%;
    background: var(--color-background);
    filter: blur(45px);
  }
}
</style>
