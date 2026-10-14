<script setup lang="ts">
import { paymentsApi } from '~/api'

// Страница «платёжного провайдера» мока: нужна, чтобы пройти весь сценарий оплаты без настоящей платёжной системы
definePageMeta({ layout: 'minimal' })
useHead({ title: () => tr('Оплата (тест) - Kango') })


const route = useRoute()
const id = computed(() => String(route.query.payment ?? ''))
const back = computed(() => String(route.query.return ?? '/new/success'))
const busy = ref(false)

async function finish(result: 'paid' | 'failed' | 'cancelled') {
  busy.value = true
  try {
    await paymentsApi.confirm(id.value, result)
  } finally {
    busy.value = false
  }
  const sep = back.value.includes('?') ? '&' : '?'
  await navigateTo(`${back.value}${sep}payment=${id.value}&status=${result}`)
}
</script>

<template>
  <KContainer as="section" class="pay">
    <h1>{{ tr('Тестовая оплата') }}</h1>
    <p>{{ tr('Это страница-заглушка платёжной системы. Платёж') }} <code>{{ id }}</code> {{ tr('не настоящий.') }}</p>
    <div class="actions">
      <KButton :disabled="busy" @click="finish('paid')">{{ tr('Оплатить') }}</KButton>
      <KButton variant="outline" :disabled="busy" @click="finish('failed')">{{ tr('Имитировать ошибку') }}</KButton>
      <KButton variant="plain" :disabled="busy" @click="finish('cancelled')">{{ tr('Отмена') }}</KButton>
    </div>
  </KContainer>
</template>

<style scoped>
.pay { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; padding-block: 32px 48px; }
h1 { margin: 0; color: var(--color-label-primary); font-size: var(--text-22-24); line-height: var(--leading-22-24); font-weight: var(--font-weight-medium); }
p { margin: 0; color: var(--color-label-secondary); }
.actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
</style>
