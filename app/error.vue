<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error.statusCode === 404)

useHead({ title: () => (notFound.value ? tr('Страница не найдена - Kango') : tr('Что-то пошло не так - Kango')) })

const home = () => clearError({ redirect: '/' })
</script>

<template>
  <NuxtLayout name="auth">
    <KContainer as="section" class="error">
      <p class="code">{{ error.statusCode }}</p>
      <h1>{{ notFound ? tr('Страница не найдена') : tr('Что-то пошло не так') }}</h1>
      <p class="text">
        {{ notFound ? tr('Такой страницы нет или она была удалена. Вернитесь на главную и попробуйте найти объявление через поиск.') : tr('Мы уже знаем о проблеме. Попробуйте обновить страницу или вернитесь на главную.') }}
      </p>
      <KButton @click="home">{{ tr('На главную') }}</KButton>
    </KContainer>
  </NuxtLayout>
</template>

<style scoped>
.error { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; padding-block: 48px; }
.code { margin: 0; color: var(--color-fill-primary); font-size: var(--text-28-28); line-height: var(--leading-28-28); font-weight: var(--font-weight-medium); }
h1 { margin: 0; color: var(--color-label-primary); font-size: var(--text-22-24); line-height: var(--leading-22-24); font-weight: var(--font-weight-medium); }
.text { margin: 0 0 12px; max-width: 520px; color: var(--color-label-secondary); font-size: var(--text-16-20); line-height: var(--leading-16-20); }
</style>
