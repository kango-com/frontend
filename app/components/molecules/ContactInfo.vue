<script setup lang="ts">
defineProps<{
  phone: string
  email: string
}>()
</script>

<template>
  <dl class="cinfo">
    <div class="cinfo__row">
      <dt>Телефон</dt>
      <dd><a :href="`tel:${phone.replace(/[^\d+]/g, '')}`">{{ phone }}</a></dd>
    </div>
    <div class="cinfo__row">
      <dt>Почта</dt>
      <dd><a :href="`mailto:${email}`">{{ email }}</a></dd>
    </div>
  </dl>
</template>

<style scoped>
.cinfo { display: flex; flex-direction: column; gap: 8px; margin: 0; }
.cinfo__row { display: flex; flex-direction: column; gap: 2px; }
.cinfo dt { color: var(--color-label-secondary); font-size: var(--text-12-16); line-height: var(--leading-12-16); }
.cinfo dd { margin: 0; font-size: var(--text-16-20); line-height: var(--leading-16-20); }
.cinfo a { color: var(--color-label-primary); text-decoration: none; }
.cinfo a:hover, .cinfo a:focus-visible { color: var(--color-fill-color-4); }
</style>
