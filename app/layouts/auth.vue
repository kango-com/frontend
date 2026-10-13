<template>
  <div class="shell">
    <header class="shell__top">
      <KContainer class="shell__bar">
        <KLogo to="/" :height="32" />
      </KContainer>
    </header>
    <main id="main" class="shell__main" tabindex="-1">
      <slot />
    </main>
    <KFooter />
    <AppTabBar />
  </div>
</template>

<style scoped>
.shell { display: flex; flex-direction: column; min-height: 100vh; min-height: 100dvh; padding-bottom: calc(56px + env(safe-area-inset-bottom)); }
.shell__bar { display: flex; align-items: center; min-height: 50px; padding-block: 3px; }
.shell__main { flex: 1; outline: 0; }
@media (min-width: 1380px) {
  .shell { padding-bottom: 0; }
  .shell__bar { min-height: 74px; }
}
</style>
