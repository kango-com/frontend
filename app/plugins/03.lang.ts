// Язык интерфейса: выбор пользователя хранится в cookie `kango_lang` (по умолчанию русский)
export default defineNuxtPlugin(async (nuxtApp) => {
  const i18n = nuxtApp.$i18n as { locale: Ref<string>, setLocale: (code: string) => Promise<void>, locales: Ref<{ code: string }[]> }
  const saved = useCookie<string | null>('kango_lang', { maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' })
  if (saved.value && saved.value !== i18n.locale.value && i18n.locales.value.some(l => l.code === saved.value)) {
    await i18n.setLocale(saved.value)
  }
  watch(i18n.locale, (code) => { saved.value = code })
})
