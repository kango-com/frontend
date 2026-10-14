<script setup lang="ts">
import mobile from '~/assets/img/hero/hero-mobile.webp'
import desktop from '~/assets/img/hero/hero-desktop.webp'

// Фон обложки главной: баннер с пляжем и кенгуру (одна картинка 1380x566 на всех ширинах),
// внизу плавно уходит в белое. На узких экранах кадрируется по кенгуру справа.
</script>

<template>
  <div class="backdrop" :style="{ '--hero-mobile': `url(${mobile})`, '--hero-desktop': `url(${desktop})` }" aria-hidden="true" />
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
</style>
