<template>
  <div class="cover">
    <HeroBackdrop />
    <KContainer class="cover__inner">
      <HomeHero class="cover__hero" />
      <SectionsGrid class="cover__sections" />
    </KContainer>
  </div>
</template>

<style scoped>
/* Обложка заходит под прозрачную шапку: поднимаем её на высоту шапки */
.cover { position: relative; margin-top: calc(var(--header-h, 50px) * -1); }

/* 375: заголовок в 115px от верха обложки (шапка 50 + 65), разделы через 12px */
.cover__inner { position: relative; z-index: 1; display: flex; flex-direction: column; padding-top: calc(var(--header-h, 50px) + 65px); }
.cover__sections { margin-top: 12px; }

/* 768: заголовок в 179px от верха, обложка 520px, разделы через 20px */
@media (min-width: 768px) {
  .cover__inner { padding-top: calc(var(--header-h, 50px) + 129px); }
  .cover__sections { margin-top: 20px; }
}

/* 1380+: заголовок слева сверху на баннере, под ним в ряд пять карточек (отсчёт от верха обложки: заголовок 151, ряд 459) */
@media (min-width: 1380px) {
  .cover__inner { padding-top: 151px; }
  .cover__sections { margin-top: 120px; }
}
</style>
