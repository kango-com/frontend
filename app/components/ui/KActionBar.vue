<template>
  <div class="kab">
    <slot />
  </div>
</template>

<style scoped>
.kab {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  background: var(--color-background);
  box-shadow: 0 -2px 12px color-mix(in srgb, var(--color-label-primary) 8%, transparent);
}
</style>
