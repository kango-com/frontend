<script setup lang="ts">
import { isEmail, safeRedirect } from '~/utils/password'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const errors = reactive<{ email?: string, password?: string, form?: string }>({})
const registerLink = computed(() => (route.query.redirect ? `/register?redirect=${encodeURIComponent(String(route.query.redirect))}` : '/register'))
const busy = computed(() => auth.status === 'loading')

onMounted(() => auth.clearError())

function validate() {
  errors.email = !email.value.trim() ? 'Заполните поля' : !isEmail(email.value) ? 'Введите корректный e-mail' : undefined
  errors.password = !password.value ? 'Заполните поля' : undefined
  return !errors.email && !errors.password
}

async function done() {
  await router.push(safeRedirect(route.query.redirect))
}

async function submit() {
  errors.form = undefined
  if (!validate()) return
  try {
    await auth.login({ email: email.value.trim(), password: password.value })
    await done()
  } catch {
    errors.email = auth.fieldErrors.email
    errors.password = auth.fieldErrors.password
    if (!errors.email && !errors.password) errors.form = auth.error?.message
  }
}

async function social(provider: 'google' | 'facebook') {
  errors.form = undefined
  try {
    await auth.social(provider)
    await done()
  } catch {
    errors.form = auth.error?.message
  }
}
</script>

<template>
  <AuthCard title="Добро пожаловать" lead="Для входа в сервис введите почту и пароль">
    <form class="lf" novalidate @submit.prevent="submit">
      <KTextField v-model="email" type="email" placeholder="E-mail" autocomplete="username" :error="errors.email" />
      <PasswordField v-model="password" autocomplete="current-password" :error="errors.password" />
      <p v-if="errors.form" class="lf__error" role="alert">{{ errors.form }}</p>
      <KTextButton to="/forgot" size="sm" class="lf__forgot">Забыли пароль?</KTextButton>
      <KButton block type="submit" :disabled="busy">{{ busy ? 'Вход...' : 'Войти' }}</KButton>
    </form>

    <div class="lf__social">
      <p class="lf__or">Войти с помощью</p>
      <div class="lf__icons">
        <SocialButton provider="facebook" :disabled="busy" @click="social('facebook')" />
        <SocialButton provider="google" :disabled="busy" @click="social('google')" />
      </div>
    </div>

    <p class="lf__switch">Нет аккаунта? <KTextButton :to="registerLink" size="sm">Зарегистрироваться</KTextButton></p>
  </AuthCard>
</template>

<style scoped>
.lf { display: flex; flex-direction: column; gap: 12px; }
.lf .lf__forgot { align-self: flex-start; }
.lf__error { margin: 0; color: var(--color-fill-error); font-size: var(--text-14-16); line-height: var(--leading-14-16); }
.lf__social { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.lf__or { margin: 0; color: var(--color-label-secondary); font-size: var(--text-14-16); }
.lf__icons { display: flex; gap: 12px; }
.lf__switch { margin: 0; text-align: center; color: var(--color-label-secondary); font-size: var(--text-14-16); }
</style>
