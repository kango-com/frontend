<script setup lang="ts">
defineProps<{
  title: string
  text?: string
  action: string
  to: string
  /** Дополнительная строка под кнопкой («Вы будете перенаправлены...») */
  note?: string
}>()
</script>

<template>
  <AuthCard :title="title">
    <p v-if="text" class="ares__text" role="status">{{ text }}</p>
    <slot />
    <KButton block :to="to">{{ action }}</KButton>
    <p v-if="note" class="ares__note">{{ note }}</p>
  </AuthCard>
</template>

<style scoped>
.ares__text { margin: 0; color: var(--color-label-secondary); font-size: var(--text-16-20); line-height: var(--leading-16-20); }
.ares__note { margin: 0; color: var(--color-label-gray); font-size: var(--text-12-16); line-height: var(--leading-12-16); text-align: center; }
</style>
