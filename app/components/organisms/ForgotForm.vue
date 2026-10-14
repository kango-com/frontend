<script setup lang="ts">
import { isEmail } from '~/utils/password'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const error = ref<string | undefined>()
const sent = ref(false)
const devLink = ref<string | undefined>()
const busy = computed(() => auth.status === 'loading')
let timer: ReturnType<typeof setTimeout> | undefined

onMounted(() => auth.clearError())
onBeforeUnmount(() => clearTimeout(timer))

async function submit() {
  error.value = !email.value.trim() ? 'Заполните поля' : !isEmail(email.value) ? 'Введите корректный e-mail' : undefined
  if (error.value) return
  try {
    const result = await auth.forgot(email.value.trim())
    devLink.value = result.devLink
    sent.value = true
    // как в макете: через 3 секунды на главную
    timer = setTimeout(() => router.push('/'), 3000)
  } catch {
    error.value = auth.fieldErrors.email ?? auth.error?.message
  }
}
</script>

<template>
  <AuthResult
    v-if="sent"
    title="Проверьте почту"
    text="Мы отправили ссылку для сброса пароля на ваш email"
    action="Войти"
    to="/login"
    note="Вы будете перенаправлены через 3 секунды на главную страницу"
  >
    <p v-if="devLink" class="ff__dev">Мок-режим, письма нет: <NuxtLink :to="devLink">открыть ссылку из письма</NuxtLink></p>
  </AuthResult>

  <AuthCard v-else title="Восстановление пароля" lead="Введите e-mail, мы отправим ссылку для сброса пароля">
    <form class="ff" novalidate @submit.prevent="submit">
      <KTextField v-model="email" type="email" placeholder="E-mail" autocomplete="username" :error="error" />
      <KButton block type="submit" :disabled="busy">{{ busy ? 'Отправка...' : 'Отправить' }}</KButton>
    </form>
  </AuthCard>
</template>

<style scoped>
.ff { display: flex; flex-direction: column; gap: 12px; }
.ff__dev { margin: 0; color: var(--color-label-secondary); font-size: var(--text-12-16); }
</style>
