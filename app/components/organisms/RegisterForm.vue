<script setup lang="ts">
import { isEmail, passwordStrength, safeRedirect } from '~/utils/password'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const repeat = ref('')
const errors = reactive<{ name?: string, email?: string, password?: string, repeat?: string, form?: string }>({})
const busy = computed(() => auth.status === 'loading')
const loginLink = computed(() => (route.query.redirect ? `/login?redirect=${encodeURIComponent(String(route.query.redirect))}` : '/login'))

onMounted(() => auth.clearError())

function validate() {
  errors.name = !name.value.trim() ? 'Заполните поля' : undefined
  errors.email = !email.value.trim() ? 'Заполните поля' : !isEmail(email.value) ? 'Введите корректный e-mail' : undefined
  errors.password = !password.value ? 'Заполните поля' : passwordStrength(password.value) === 'short' ? 'Короткий пароль' : undefined
  errors.repeat = !repeat.value ? 'Заполните поля' : repeat.value !== password.value ? 'Пароли не совпадают' : undefined
  return !errors.name && !errors.email && !errors.password && !errors.repeat
}

async function submit() {
  errors.form = undefined
  if (!validate()) return
  try {
    await auth.register({ name: name.value.trim(), email: email.value.trim(), password: password.value })
    await router.push(safeRedirect(route.query.redirect))
  } catch {
    errors.name = auth.fieldErrors.name
    errors.email = auth.fieldErrors.email
    errors.password = auth.fieldErrors.password
    if (!Object.values(auth.fieldErrors).length) errors.form = auth.error?.message
  }
}
</script>

<template>
  <AuthCard title="Регистрация" lead="Чтобы подавать объявления и управлять ими, создайте аккаунт">
    <form class="rf" novalidate @submit.prevent="submit">
      <KTextField v-model="name" placeholder="Имя" autocomplete="name" :error="errors.name" />
      <KTextField v-model="email" type="email" placeholder="E-mail" autocomplete="username" :error="errors.email" />
      <PasswordField v-model="password" strength autocomplete="new-password" :error="errors.password" />
      <PasswordField v-model="repeat" placeholder="Повторите пароль" autocomplete="new-password" :error="errors.repeat" />
      <p v-if="errors.form" class="rf__error" role="alert">{{ errors.form }}</p>
      <KButton block type="submit" :disabled="busy">{{ busy ? 'Регистрация...' : 'Зарегистрироваться' }}</KButton>
      <p class="rf__policy">
        Нажимая «Зарегистрироваться», вы соглашаетесь с
        <KTextButton to="/documents" size="sm" underline>политикой конфиденциальности</KTextButton>
      </p>
    </form>
    <p class="rf__switch">Зарегистрированы? <KTextButton :to="loginLink" size="sm">Войти</KTextButton></p>
  </AuthCard>
</template>

<style scoped>
.rf { display: flex; flex-direction: column; gap: 12px; }
.rf__error { margin: 0; color: var(--color-fill-error); font-size: var(--text-14-16); line-height: var(--leading-14-16); }
.rf__policy, .rf__switch { margin: 0; color: var(--color-label-secondary); font-size: var(--text-12-16); line-height: var(--leading-12-16); text-align: center; }
.rf__switch { font-size: var(--text-14-16); }
</style>
