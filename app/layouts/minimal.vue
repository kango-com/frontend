<template>
  <div class="shell">
    <header class="shell__top">
      <KContainer class="shell__bar">
        <KLogo to="/" :height="32" />
        <KTextButton to="/" size="md">{{ tr('Закрыть') }}</KTextButton>
      </KContainer>
    </header>
    <main id="main" class="shell__main" tabindex="-1">
      <slot />
    </main>
    <KFooter />
  </div>
</template>

<style scoped>
.shell { display: flex; flex-direction: column; min-height: 100vh; min-height: 100dvh; }
.shell__bar { display: flex; align-items: center; justify-content: space-between; min-height: 50px; padding-block: 3px; }
.shell__main { flex: 1; outline: 0; }
@media (min-width: 1380px) {
  .shell__bar { min-height: 74px; }
}
</style>
