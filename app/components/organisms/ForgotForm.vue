<script setup lang="ts">
import { isEmail } from '~/utils/password'

const props = defineProps<{
  /** Форма в модальном окне входа */
  modal?: boolean
}>()

const auth = useAuthStore()
const ui = useUiStore()
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
  error.value = !email.value.trim() ? tr('Заполните поля') : !isEmail(email.value) ? tr('Введите корректный e-mail') : undefined
  if (error.value) return
  try {
    const result = await auth.forgot(email.value.trim())
    devLink.value = result.devLink
    sent.value = true
    // как в макете: через 3 секунды на главную (в модалке остаёмся на странице)
    if (!props.modal) timer = setTimeout(() => router.push('/'), 3000)
  } catch {
    error.value = auth.fieldErrors.email ?? auth.error?.message
  }
}
</script>

<template>
  <AuthResult
    v-if="sent"
    :title="tr('Проверьте почту')"
    :text="tr('Мы отправили ссылку для сброса пароля на ваш email')"
    :action="tr('Войти')"
    :to="modal ? undefined : '/login'"
    :plain="modal"
    :note="modal ? undefined : tr('Вы будете перенаправлены через 3 секунды на главную страницу')"
    @action="modal && (ui.authView = 'login')"
  >
    <p v-if="devLink" class="ff__dev">{{ tr('Мок-режим, письма нет:') }} <NuxtLink :to="devLink" @click="modal && ui.close('login')">{{ tr('открыть ссылку из письма') }}</NuxtLink></p>
  </AuthResult>

  <AuthCard v-else :title="tr('Восстановление пароля')" :lead="tr('Введите e-mail, мы отправим ссылку для сброса пароля')" :plain="modal">
    <form class="ff" novalidate @submit.prevent="submit">
      <KTextField v-model="email" type="email" placeholder="E-mail" autocomplete="username" :error="error" />
      <KButton block type="submit" :disabled="busy">{{ busy ? tr('Отправка...') : tr('Отправить') }}</KButton>
      <KTextButton v-if="modal" size="sm" class="ff__back" @click="ui.authView = 'login'">{{ tr('Назад ко входу') }}</KTextButton>
    </form>
  </AuthCard>
</template>

<style scoped>
.ff { display: flex; flex-direction: column; gap: 12px; }
.ff .ff__back { align-self: center; }
.ff__dev { margin: 0; color: var(--color-label-secondary); font-size: var(--text-12-16); }
</style>
