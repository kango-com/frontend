<script setup lang="ts">
import { passwordStrength } from '~/utils/password'

/** Создание нового пароля по ссылке из письма: форма, «Пароль изменён», «Ссылка устарела» */
const auth = useAuthStore()
const route = useRoute()

const token = computed(() => (typeof route.query.token === 'string' ? route.query.token : ''))
const state = ref<'checking' | 'form' | 'done' | 'expired'>('checking')
const password = ref('')
const repeat = ref('')
const errors = reactive<{ password?: string, repeat?: string, form?: string }>({})
const busy = computed(() => auth.status === 'loading')

onMounted(async () => {
  auth.clearError()
  if (!token.value) { state.value = 'expired'; return }
  try {
    state.value = (await auth.validateResetToken(token.value)).valid ? 'form' : 'expired'
  } catch {
    state.value = 'expired'
  }
})

async function submit() {
  errors.form = undefined
  errors.password = !password.value ? tr('Заполните поля') : passwordStrength(password.value) === 'short' ? tr('Короткий пароль') : undefined
  errors.repeat = !repeat.value ? tr('Заполните поля') : repeat.value !== password.value ? tr('Пароли не совпадают') : undefined
  if (errors.password || errors.repeat) return
  try {
    await auth.reset(token.value, password.value)
    state.value = 'done'
  } catch {
    if (auth.error?.status === 410) { state.value = 'expired'; return }
    errors.password = auth.fieldErrors.password
    if (!errors.password) errors.form = auth.error?.message
  }
}
</script>

<template>
  <AuthCard v-if="state === 'checking'" :title="tr('Сброс пароля')">
    <p class="rsf__note" aria-busy="true">{{ tr('Проверяем ссылку...') }}</p>
  </AuthCard>

  <AuthResult v-else-if="state === 'done'" :title="tr('Пароль изменён')" :text="tr('Теперь вы можете войти в аккаунт с новым паролем')" :action="tr('Войти')" to="/login" />

  <AuthResult v-else-if="state === 'expired'" :title="tr('Ссылка устарела')" :text="tr('Не переживайте, запросите новый сброс пароля')" :action="tr('Восстановить пароль')" to="/forgot" />

  <AuthCard v-else :title="tr('Сброс пароля')" :lead="tr('Придумайте новый пароль')">
    <form class="rsf" novalidate @submit.prevent="submit">
      <PasswordField v-model="password" strength :placeholder="tr('Новый пароль')" autocomplete="new-password" :error="errors.password" />
      <PasswordField v-model="repeat" :placeholder="tr('Повторите пароль')" autocomplete="new-password" :error="errors.repeat" />
      <p v-if="errors.form" class="rsf__error" role="alert">{{ errors.form }}</p>
      <KButton block type="submit" :disabled="busy">{{ busy ? tr('Сохранение...') : tr('Сохранить пароль') }}</KButton>
    </form>
  </AuthCard>
</template>

<style scoped>
.rsf { display: flex; flex-direction: column; gap: 12px; }
.rsf__error { margin: 0; color: var(--color-fill-error); font-size: var(--text-14-16); }
.rsf__note { margin: 0; color: var(--color-label-secondary); }
</style>
