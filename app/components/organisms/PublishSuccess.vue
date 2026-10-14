<script setup lang="ts">
defineProps<{
  /** С продвижением ли опубликовано */
  promoted?: boolean
  adId?: string
}>()
</script>

<template>
  <section class="psucc" aria-labelledby="psucc-title">
    <span class="psucc__icon" aria-hidden="true"><Icon name="kango:check-20" size="20" /></span>
    <h1 id="psucc-title" class="psucc__title">{{ promoted ? 'Оплата прошла успешно!' : 'Объявление опубликовано!' }}</h1>
    <p class="psucc__text" role="status">{{ promoted ? 'Ваше объявление опубликовано с продвижением!' : 'Оно уже доступно в ленте и в поиске.' }}</p>
    <KButton v-if="adId" block :to="`/ad/${adId}`">Перейти к объявлению</KButton>
    <KButton block variant="outline" to="/">На главную</KButton>
  </section>
</template>

<style scoped>
.psucc { display: flex; flex-direction: column; align-items: stretch; gap: 12px; width: 100%; max-width: 400px; margin: 48px auto; padding: 0 16px; text-align: center; }
.psucc__icon { align-self: center; display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; border-radius: 50%; background: var(--color-fill-primary); color: var(--color-label-white); }
.psucc__title { margin: 0; font-size: var(--text-22-24); line-height: var(--leading-22-24); font-weight: var(--font-weight-medium); }
.psucc__text { margin: 0 0 8px; color: var(--color-label-secondary); font-size: var(--text-16-20); line-height: var(--leading-16-20); }
</style>
