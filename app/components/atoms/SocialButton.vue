<script setup lang="ts">
defineProps<{
  provider: 'google' | 'facebook'
  disabled?: boolean
}>()

defineEmits<{ click: [] }>()

const NAMES = { google: 'Google', facebook: 'Facebook' }
</script>

<template>
  <button type="button" class="soc" :disabled="disabled" :aria-label="tr('Войти через {name}', { name: NAMES[provider] })" @click="$emit('click')">
    <Icon :name="`kango:${provider}`" size="28" />
  </button>
</template>

<style scoped>
.soc {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 44px;
  border: var(--border-width) solid var(--color-stroke-gray);
  border-radius: var(--radius-md);
  background: var(--color-background);
  cursor: pointer;
}
.soc:disabled { opacity: 0.5; cursor: default; }
.soc:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
@media (hover: hover) { .soc:not(:disabled):hover { border-color: var(--color-stroke-primary); } }
</style>
