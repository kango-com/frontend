<script setup lang="ts">
import { isEmail } from '~/utils/password'

const props = defineProps<{
  /** Форма в модальном окне: после входа окно закрывается, пользователь остаётся на странице */
  modal?: boolean
}>()

const { locale } = useI18n()
const auth = useAuthStore()
const ui = useUiStore()
const route = useRoute()

/** Куда вести после входа: в модалке из стора, на странице входа из адреса */
const redirect = computed(() => (props.modal ? ui.loginRedirect : (route.query.redirect as string | undefined)) ?? undefined)

const email = ref('')
const password = ref('')
const errors = reactive<{ email?: string, password?: string, form?: string }>({})
const registerLink = computed(() => (redirect.value ? `/register?redirect=${encodeURIComponent(String(redirect.value))}` : '/register'))
/** В модалке экраны переключаются внутри окна, на странице работают обычные ссылки */
const go = (view: 'register' | 'forgot') => { if (props.modal) ui.authView = view }
/** Вход через Facebook и Google скрыт в русской версии интерфейса */
const showSocial = computed(() => locale.value !== 'ru')
const busy = computed(() => auth.status === 'loading')

onMounted(() => auth.clearError())

function validate() {
  errors.email = !email.value.trim() ? tr('Заполните поля') : !isEmail(email.value) ? tr('Введите корректный e-mail') : undefined
  errors.password = !password.value ? tr('Заполните поля') : undefined
  return !errors.email && !errors.password
}

const done = useAuthDone(() => props.modal)

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
  <AuthCard :title="tr('Добро пожаловать')" :lead="tr('Для входа в сервис введите почту и пароль')" :plain="modal">
    <form class="lf" :class="{ 'lf--modal': modal }" novalidate @submit.prevent="submit">
      <KTextField v-model="email" type="email" placeholder="E-mail" autocomplete="username" :error="errors.email" />
      <PasswordField v-model="password" autocomplete="current-password" :error="errors.password" />
      <p v-if="errors.form" class="lf__error" role="alert">{{ errors.form }}</p>
      <KTextButton :to="modal ? undefined : '/forgot'" size="sm" class="lf__forgot" @click="go('forgot')">{{ tr('Забыли пароль?') }}</KTextButton>
      <KButton block type="submit" :disabled="busy">{{ busy ? tr('Вход...') : tr('Войти') }}</KButton>
    </form>

    <div v-if="showSocial" class="lf__social" :class="{ 'lf__social--modal': modal }">
      <p class="lf__or">{{ modal ? tr('или войдите с помощью') : tr('Войти с помощью') }}</p>
      <div class="lf__icons">
        <SocialButton provider="facebook" :wide="modal" :disabled="busy" @click="social('facebook')" />
        <SocialButton provider="google" :wide="modal" :disabled="busy" @click="social('google')" />
      </div>
    </div>

    <p class="lf__switch" :class="{ 'lf__switch--modal': modal }">{{ tr('Нет аккаунта?') }} <KTextButton :to="modal ? undefined : registerLink" size="sm" @click="go('register')">{{ tr('Зарегистрироваться') }}</KTextButton></p>
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
/* в модалке: «Забыли пароль?» справа, разделитель «или» с линиями, ряд широких кнопок, нижняя строка отделена чертой */
.lf--modal { text-align: left; }
.lf--modal .lf__forgot { align-self: flex-end; margin-top: -4px; }
.lf__social--modal { width: 100%; gap: 14px; }
.lf__social--modal .lf__or { display: flex; align-items: center; gap: 12px; width: 100%; }
.lf__social--modal .lf__or::before,
.lf__social--modal .lf__or::after { content: ''; flex: 1; height: 1px; background: var(--color-separator-gray); }
.lf__social--modal .lf__icons { width: 100%; }
.lf__switch--modal { margin-top: 4px; padding-top: 18px; border-top: var(--border-width) solid var(--color-separator-gray); }
</style>
