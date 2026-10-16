<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div class="shell">
    <a class="shell__skip" href="#main">{{ tr('К содержимому') }}</a>
    <AppHeader :class="{ 'shell__header--no-mobile': !!route.meta.hideHeaderMobile }" />
    <main id="main" class="shell__main" tabindex="-1">
      <slot />
    </main>
    <KFooter />
    <AppTabBar />
    <CitySelector />
    <LoginModal />
    <FilterPanel />
    <CategoriesMenu />
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
  .shell { --header-h: 128px; padding-bottom: 0; }
}
@media (min-width: 1920px) {
  .shell { --header-h: 128px; }
}
@media (max-width: 767px) {
  .shell__header--no-mobile { display: none; }
}
</style>
