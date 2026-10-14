<script setup lang="ts">
// язык и направление текста (иврит справа налево) для всего документа
const { locale, locales } = useI18n()
const dir = computed<'ltr' | 'rtl'>(() => ((locales.value as { code: string, dir?: string }[]).find(l => l.code === locale.value)?.dir === 'rtl' ? 'rtl' : 'ltr'))
useHead({ htmlAttrs: { lang: locale, dir } })
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
