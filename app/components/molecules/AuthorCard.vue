<script setup lang="ts">
import { formatSince } from '~/utils/ad-view'

defineProps<{
  name: string
  online?: boolean
  /** ISO-дата регистрации */
  since: string
}>()
</script>

<template>
  <div class="auth">
    <span class="auth__avatar" aria-hidden="true"><Icon name="kango:user-24" size="24" /></span>
    <div class="auth__text">
      <span class="auth__name">{{ name }}</span>
      <span class="auth__meta">
        <span v-if="online" class="auth__online">{{ tr('Онлайн') }}</span>
        {{ tr('На сервисе с') }} {{ formatSince(since) }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.auth { display: flex; align-items: center; gap: 12px; }
.auth__avatar { display: inline-flex; flex: none; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: var(--radius-pill); background: var(--color-fill-gray-3); color: var(--color-fill-gray); }
.auth__text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.auth__name { color: var(--color-label-primary); font-size: var(--text-16-20); line-height: var(--leading-16-20); font-weight: var(--font-weight-medium); }
.auth__meta { color: var(--color-label-secondary); font-size: var(--text-12-16); line-height: var(--leading-12-16); }
.auth__online { margin-right: 8px; color: var(--color-fill-color-4); }
.auth__online::before { content: ''; display: inline-block; width: 6px; height: 6px; margin-right: 4px; border-radius: 50%; background: currentColor; vertical-align: middle; }
</style>
