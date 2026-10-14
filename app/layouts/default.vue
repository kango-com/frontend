<template>
  <div class="shell">
    <a class="shell__skip" href="#main">К содержимому</a>
    <AppHeader />
    <main id="main" class="shell__main" tabindex="-1">
      <slot />
    </main>
    <KFooter />
    <AppTabBar />
    <CitySelector />
    <FilterPanel />
  </div>
</template>

<style scoped>
.shell { --header-h: 50px; display: flex; flex-direction: column; min-height: 100vh; min-height: 100dvh; }
.shell__main { flex: 1; outline: 0; }
/* Место под нижний таббар на 375 и 768 */
.shell { padding-bottom: calc(56px + env(safe-area-inset-bottom)); }
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
  .shell { --header-h: 104px; padding-bottom: 0; }
}
</style>
