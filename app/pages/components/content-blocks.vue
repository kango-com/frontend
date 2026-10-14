<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Блоки контента - Kango' })
</script>

<template>
  <ShowPage title="Блоки контента" hint="Контакты, офис, форма обратной связи. Страницы: /about, /support, /documents, /details.">
    <ShowSection title="Молекулы">
      <ShowItem label="ContactInfo"><ContactInfo phone="+972 3 000 00 00" email="hello@kango.com" /></ShowItem>
      <ShowItem label="OfficeCard"><div class="w"><OfficeCard address="Тель-Авив, ул. Ротшильд 1" hours="Вс-Чт, 9:00-18:00" /></div></ShowItem>
    </ShowSection>
    <ShowSection title="Организмы">
      <ShowItem label="FeedbackForm"><div class="w"><FeedbackForm /></div></ShowItem>
    </ShowSection>
  </ShowPage>
</template>

<style scoped>
.w { width: min(100%, 420px); }
</style>
