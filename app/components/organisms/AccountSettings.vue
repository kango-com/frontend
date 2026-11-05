<script setup lang="ts">
import type { Lang, NotificationSettings } from '~/types'

/** «Настройки»: язык интерфейса, уведомления, смена пароля (ТЗ п. 7.1, 11.1) */
const auth = useAuthStore()
const { locale, setLocale } = useI18n()

/** Короткая отметка «Сохранено» у заголовка карточки, гаснет через 2 с */
function useSavedFlag() {
  const text = ref('')
  let timer: ReturnType<typeof setTimeout> | undefined
  const flash = () => {
    text.value = tr('Сохранено')
    clearTimeout(timer)
    timer = setTimeout(() => { text.value = '' }, 2000)
  }
  onBeforeUnmount(() => clearTimeout(timer))
  return { text, flash }
}

// Язык: переключается сразу и сохраняется в профиле (ТЗ 11.1: выбор хранится в профиле)
const LANGS: { value: Lang, label: string }[] = [
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
  { value: 'he', label: 'עברית' }
]
const langSaved = useSavedFlag()
async function setLang(code: string) {
  if (code === locale.value) return
  await setLocale(code as Lang)
  try {
    await auth.updateProfile({ language: code as Lang })
    langSaved.flash()
  } catch { /* язык в cookie уже сменён */ }
}

// Уведомления: каждое переключение сохраняется сразу
const DEFAULTS: NotificationSettings = { email: true, push: false, messages: true, moderation: true, support: true, promo: false }
const notify = computed<NotificationSettings>(() => ({ ...DEFAULTS, ...auth.user?.notifications }))
const notifySaved = useSavedFlag()
const notifyError = ref<{ key: keyof NotificationSettings, text: string } | null>(null)

// push зависит от браузера: не поддерживается или запрещён - переключатель недоступен и объясняет почему
const pushPermission = ref<NotificationPermission | 'unsupported'>('default')
onMounted(() => { pushPermission.value = 'Notification' in window ? Notification.permission : 'unsupported' })
const pushHint = computed(() => ({
  unsupported: tr('Этот браузер не поддерживает push-уведомления'),
  denied: tr('Запрещены в браузере. Разрешите уведомления в настройках сайта'),
  granted: tr('На этом устройстве'),
  default: tr('Браузер спросит разрешение')
})[pushPermission.value])

const CHANNELS = computed(() => [
  { key: 'email' as const, label: tr('По e-mail'), hint: auth.user?.email },
  { key: 'push' as const, label: tr('Push-уведомления'), hint: pushHint.value, disabled: pushPermission.value === 'unsupported' || pushPermission.value === 'denied' }
])
const TYPES: { key: keyof NotificationSettings, label: string, hint: string }[] = [
  { key: 'messages', label: 'Новые сообщения', hint: 'Когда вам пишут по объявлению' },
  { key: 'moderation', label: 'Проверка объявлений', hint: 'Объявление одобрено или отклонено' },
  { key: 'support', label: 'Ответы поддержки', hint: 'Ответы на ваши обращения' },
  { key: 'promo', label: 'Новости и акции Kango', hint: 'Новые возможности и специальные предложения' }
]

async function toggle(key: keyof NotificationSettings, value: boolean) {
  notifyError.value = null
  if (key === 'push' && value && pushPermission.value === 'default') {
    pushPermission.value = await Notification.requestPermission()
    if (pushPermission.value !== 'granted') return
  }
  try {
    await auth.updateProfile({ notifications: { ...notify.value, [key]: value } })
    notifySaved.flash()
  } catch {
    notifyError.value = { key, text: tr('Не удалось сохранить настройку. Попробуйте ещё раз.') }
  }
}

// Пароль
const pwd = reactive({ current: '', next: '' })
const pwdErrors = ref<Record<string, string>>({})
const pwdBusy = ref(false)
const pwdSaved = useSavedFlag()
async function changePassword() {
  pwdErrors.value = {}
  if (!pwd.current) pwdErrors.value.current = tr('Введите текущий пароль')
  if (pwd.next.length < 8) pwdErrors.value.next = tr('Не меньше 8 символов')
  if (Object.keys(pwdErrors.value).length) return
  pwdBusy.value = true
  try {
    await auth.changePassword({ current: pwd.current, next: pwd.next })
    pwd.current = ''
    pwd.next = ''
    pwdSaved.flash()
  } catch {
    const f = auth.fieldErrors
    pwdErrors.value = f.current || f.next
      ? { ...(f.current ? { current: f.current } : {}), ...(f.next ? { next: f.next } : {}) }
      : { form: auth.error?.message ?? tr('Не удалось сменить пароль. Попробуйте ещё раз.') }
  } finally {
    pwdBusy.value = false
  }
}
</script>

<template>
  <section class="aset">
    <CabinetPageHead :title="tr('Настройки')" />

    <CabinetCard :title="tr('Язык интерфейса')" :description="tr('Язык меню, кнопок и писем от Kango. Объявления показываются на языке автора.')" :status="langSaved.text.value">
      <KSegmentControl :model-value="locale" :options="LANGS" :label="tr('Язык интерфейса')" @update:model-value="setLang" />
    </CabinetCard>

    <CabinetCard :title="tr('Уведомления')" :status="notifySaved.text.value">
      <div class="aset__group" role="group" :aria-label="tr('Как сообщать')">
        <h3 class="aset__subtitle">{{ tr('Как сообщать') }}</h3>
        <div v-for="c in CHANNELS" :key="c.key" class="aset__row">
          <KSwitch row :model-value="notify[c.key] && !c.disabled" :description="c.hint" :disabled="c.disabled" @update:model-value="toggle(c.key, $event)">{{ c.label }}</KSwitch>
          <p v-if="notifyError?.key === c.key" class="aset__error" role="alert">{{ notifyError.text }}</p>
        </div>
      </div>
      <div class="aset__group" role="group" :aria-label="tr('О чём сообщать')">
        <h3 class="aset__subtitle">{{ tr('О чём сообщать') }}</h3>
        <div v-for="t in TYPES" :key="t.key" class="aset__row">
          <KSwitch row :model-value="notify[t.key]" :description="tr(t.hint)" @update:model-value="toggle(t.key, $event)">{{ tr(t.label) }}</KSwitch>
          <p v-if="notifyError?.key === t.key" class="aset__error" role="alert">{{ notifyError.text }}</p>
        </div>
      </div>
    </CabinetCard>

    <CabinetCard :title="tr('Пароль')" :description="tr('Используется для входа по e-mail.')" :status="pwdSaved.text.value">
      <form class="aset__pwd" novalidate @submit.prevent="changePassword">
        <div class="aset__fields">
          <KTextField v-model="pwd.current" type="password" :label="tr('Текущий пароль')" :placeholder="tr('Текущий пароль')" autocomplete="current-password" :clearable="false" :error="pwdErrors.current" />
          <KTextField v-model="pwd.next" type="password" :label="tr('Новый пароль')" :placeholder="tr('Новый пароль')" autocomplete="new-password" :clearable="false" :error="pwdErrors.next" :description="pwdErrors.next ? undefined : tr('Не меньше 8 символов')" />
        </div>
        <p v-if="pwdErrors.form" class="aset__error" role="alert">{{ pwdErrors.form }}</p>
        <div class="aset__actions">
          <KButton type="submit" variant="outline" :disabled="pwdBusy">{{ pwdBusy ? tr('Сохраняем...') : tr('Сменить пароль') }}</KButton>
          <KTextButton to="/forgot" size="sm">{{ tr('Не помню текущий пароль') }}</KTextButton>
        </div>
      </form>
    </CabinetCard>
  </section>
</template>

<style scoped>
.aset { display: flex; flex-direction: column; gap: 16px; max-width: 760px; }
.aset__group { display: flex; flex-direction: column; }
.aset__group + .aset__group { padding-top: 16px; border-top: var(--border-width) solid var(--color-separator-gray); }
.aset__subtitle { margin: 0 0 4px; color: var(--color-label-secondary); font-size: var(--text-13-16); line-height: var(--leading-13-16); font-weight: var(--font-weight-regular); text-transform: uppercase; letter-spacing: 0.04em; }
.aset__row + .aset__row { border-top: var(--border-width) solid var(--color-fill-gray-3); }
.aset__pwd { display: flex; flex-direction: column; gap: 16px; }
.aset__fields { display: grid; grid-template-columns: minmax(0, 1fr); gap: 12px; }
.aset__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px; }
.aset__actions > :first-child { min-width: 200px; }
.aset__error { margin: 0 0 8px; color: var(--color-fill-error); font-size: var(--text-13-16); line-height: var(--leading-13-16); }
@media (min-width: 768px) {
  .aset { gap: 20px; }
  .aset__fields { grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; }
}
</style>
