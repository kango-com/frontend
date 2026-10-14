<script setup lang="ts">
defineProps<{
  phone?: string
  email?: string
  address?: string
}>()
</script>

<template>
  <dl class="cinfo">
    <div v-if="phone" class="cinfo__row">
      <dt>Телефон</dt>
      <dd><a :href="`tel:${phone.replace(/[^\d+]/g, '')}`">{{ phone }}</a></dd>
    </div>
    <div v-if="email" class="cinfo__row">
      <dt>E-mail</dt>
      <dd><a :href="`mailto:${email}`">{{ email }}</a></dd>
    </div>
    <div v-if="address" class="cinfo__row">
      <dt>Адрес</dt>
      <dd>{{ address }}</dd>
    </div>
  </dl>
</template>

<style scoped>
.cinfo { display: flex; flex-direction: column; margin: 0; }
.cinfo__row { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; padding: 6px 0; border-bottom: var(--border-width) solid var(--color-separator-gray); }
.cinfo dt { flex: none; color: var(--color-label-secondary); font-size: var(--text-14-16); line-height: var(--leading-14-16); }
.cinfo dd { margin: 0; text-align: right; font-size: var(--text-16-20); line-height: var(--leading-16-20); overflow-wrap: anywhere; }
.cinfo a { color: var(--color-label-primary); text-decoration: none; }
.cinfo a:hover, .cinfo a:focus-visible { color: var(--color-fill-color-4); }
</style>
