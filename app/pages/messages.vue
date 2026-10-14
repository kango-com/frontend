<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'auth' })
useHead({ title: () => tr('Сообщения - Kango') })
</script>

<template>
  <PagePlaceholder :title="tr('Сообщения')" :description="tr('Здесь появится переписка по объявлениям. Пока связаться с автором можно по телефону, WhatsApp или Telegram со страницы объявления.')" task="0041" />
</template>
