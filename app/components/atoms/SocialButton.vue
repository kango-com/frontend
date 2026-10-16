<script setup lang="ts">
defineProps<{
  provider: 'google' | 'facebook'
  disabled?: boolean
  /** Широкая кнопка с названием сервиса (в окне входа) */
  wide?: boolean
}>()

defineEmits<{ click: [] }>()

const NAMES = { google: 'Google', facebook: 'Facebook' }
</script>

<template>
  <button type="button" class="soc" :class="{ 'soc--wide': wide }" :disabled="disabled" :aria-label="tr('Войти через {name}', { name: NAMES[provider] })" @click="$emit('click')">
    <Icon :name="`kango:${provider}`" :size="wide ? 24 : 28" />
    <span v-if="wide" class="soc__name">{{ NAMES[provider] }}</span>
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
.soc--wide { flex: 1; gap: 10px; width: auto; min-width: 0; color: var(--color-label-primary); font-family: inherit; font-size: var(--text-15-16); font-weight: var(--font-weight-medium); }
.soc:disabled { opacity: 0.5; cursor: default; }
.soc:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
@media (hover: hover) { .soc:not(:disabled):hover { border-color: var(--color-stroke-primary); } }
</style>
