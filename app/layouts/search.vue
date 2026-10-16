<template>
  <div class="shell">
    <a class="shell__skip" href="#main">{{ tr('К содержимому') }}</a>
    <AppHeader class="shell__header" />
    <main id="main" class="shell__main" tabindex="-1">
      <KContainer>
        <slot />
      </KContainer>
    </main>
    <KFooter class="shell__footer" />
    <CitySelector />
    <LoginModal />
    <CategoriesMenu />
  </div>
</template>

<style scoped>
/* На 375 и 768 экран поиска полноэкранный: без шапки, подвала и таббара */
.shell { --header-h: 50px; display: flex; flex-direction: column; min-height: 100vh; min-height: 100dvh; }
.shell__main { flex: 1; outline: 0; }
.shell__header,
.shell__footer { display: none; }
.shell__skip {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 100;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-label-primary);
  transform: translateY(-200%);
}
.shell__skip:focus { transform: none; }
@media (min-width: 1380px) {
  .shell { --header-h: 128px; }
  .shell__header { display: block; }
  .shell__footer { display: block; }
}
@media (min-width: 1920px) {
  .shell { --header-h: 128px; }
}
</style>
