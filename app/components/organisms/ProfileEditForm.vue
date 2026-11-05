<script setup lang="ts">
import { contentApi } from '~/api'

/** «Мой профиль»: фото, имя, e-mail и контакты по умолчанию для новых объявлений (ТЗ п. 7.1, 4.1) */
const auth = useAuthStore()

const form = reactive({ name: '', email: '', phone: '', whatsapp: false, telegram: '', avatarUrl: '' as string | undefined })
function fill() {
  const u = auth.user
  if (!u) return
  Object.assign(form, { name: u.name, email: u.email, phone: u.phone ?? '', whatsapp: !!u.whatsapp, telegram: u.telegram ?? '', avatarUrl: u.avatarUrl })
}
watch(() => auth.user, fill, { immediate: true })
onMounted(() => auth.clearError())

const errors = computed(() => auth.fieldErrors)
const busy = computed(() => auth.status === 'loading')
const saved = ref(false)
const failed = ref('')

const dirty = computed(() => {
  const u = auth.user
  if (!u) return false
  return form.name !== u.name || form.email !== u.email || form.phone !== (u.phone ?? '') || form.whatsapp !== !!u.whatsapp
    || form.telegram !== (u.telegram ?? '') || form.avatarUrl !== u.avatarUrl
})
useLeaveGuard(dirty)

// фото: загрузка в хранилище, в профиль уходит только адрес
const fileInput = ref<HTMLInputElement>()
const uploading = ref(false)
const photoError = ref('')
async function onFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  ;(e.target as HTMLInputElement).value = ''
  if (!file) return
  photoError.value = ''
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { photoError.value = tr('Подойдёт фото в формате JPEG, PNG или WebP.'); return }
  if (file.size > 5 * 1024 * 1024) { photoError.value = tr('Фото больше 5 МБ. Выберите файл поменьше.'); return }
  uploading.value = true
  try {
    form.avatarUrl = (await contentApi.upload(file)).url
  } catch {
    photoError.value = tr('Не удалось загрузить фото. Попробуйте ещё раз.')
  } finally {
    uploading.value = false
  }
}

async function submit() {
  saved.value = false
  failed.value = ''
  try {
    await auth.updateProfile({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      whatsapp: form.whatsapp && !!form.phone.trim(),
      telegram: form.telegram.trim() || undefined,
      avatarUrl: form.avatarUrl
    })
    saved.value = true
  } catch {
    if (!Object.keys(errors.value).length) failed.value = auth.error?.message ?? tr('Не удалось сохранить. Попробуйте ещё раз.')
  }
}
</script>

<template>
  <section class="pef">
    <CabinetPageHead :title="tr('Мой профиль')" />

    <form class="pef__form" novalidate @submit.prevent="submit">
      <CabinetCard :title="tr('Фото и имя')" :description="tr('Так вас видят другие пользователи в объявлениях и сообщениях.')">
        <div class="pef__photo">
          <UserAvatar :name="form.name" :src="form.avatarUrl" :size="80" />
          <div class="pef__photo-actions">
            <KButton variant="outline" :disabled="uploading" @click="fileInput?.click()">
              {{ uploading ? tr('Загружаем...') : form.avatarUrl ? tr('Заменить фото') : tr('Загрузить фото') }}
            </KButton>
            <KTextButton v-if="form.avatarUrl" size="sm" @click="form.avatarUrl = undefined">{{ tr('Удалить фото') }}</KTextButton>
            <span v-else class="pef__hint">{{ tr('JPEG, PNG или WebP, до 5 МБ') }}</span>
            <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/webp" class="pef__file" tabindex="-1" aria-hidden="true" @change="onFile">
          </div>
        </div>
        <p v-if="photoError" class="pef__error" role="alert">{{ photoError }}</p>
        <KTextField v-model="form.name" :label="tr('Имя и фамилия')" :placeholder="tr('Имя и фамилия')" autocomplete="name" :error="errors.name" />
      </CabinetCard>

      <CabinetCard :title="tr('Вход')" :description="tr('На этот адрес приходят письма для входа и уведомления.')">
        <KTextField v-model="form.email" type="email" label="E-mail" placeholder="E-mail" autocomplete="email" :error="errors.email" />
        <KTextButton to="/profile/settings" size="sm" class="pef__link">{{ tr('Сменить пароль') }}</KTextButton>
      </CabinetCard>

      <CabinetCard :title="tr('Контакты для объявлений')" :description="tr('Подставляются в новые объявления. В каждом объявлении их можно изменить.')">
        <KTextField v-model="form.phone" type="tel" :label="tr('Телефон')" placeholder="+972 50 123 45 67" autocomplete="tel" :error="errors.phone" />
        <KSwitch v-model="form.whatsapp" row :disabled="!form.phone.trim()" :description="form.phone.trim() ? tr('Покупатели смогут написать вам в WhatsApp') : tr('Сначала укажите телефон')">{{ tr('WhatsApp на этом номере') }}</KSwitch>
        <KTextField v-model="form.telegram" label="Telegram" placeholder="@username" :error="errors.telegram" :description="errors.telegram ? undefined : tr('@username или ссылка t.me')" />
      </CabinetCard>

      <div class="pef__bar" :class="{ 'pef__bar--dirty': dirty }">
        <p v-if="failed" class="pef__error" role="alert">{{ failed }}</p>
        <p v-else-if="saved && !dirty" class="pef__ok" role="status"><Icon name="kango:check-16" size="16" />{{ tr('Изменения сохранены') }}</p>
        <p v-else-if="dirty" class="pef__hint">{{ tr('Есть несохранённые изменения') }}</p>
        <div class="pef__actions">
          <KButton v-if="dirty" variant="outline" @click="fill">{{ tr('Отменить') }}</KButton>
          <KButton type="submit" :disabled="busy || uploading || !dirty">{{ busy ? tr('Сохраняем...') : tr('Сохранить') }}</KButton>
        </div>
      </div>
    </form>
  </section>
</template>

<style scoped>
.pef { display: flex; flex-direction: column; gap: 16px; max-width: 760px; }
.pef__form { display: flex; flex-direction: column; gap: 16px; }
.pef__photo { display: flex; align-items: center; gap: 16px; }
.pef__photo-actions { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
.pef__file { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.pef__hint { margin: 0; color: var(--color-label-secondary); font-size: var(--text-13-16); line-height: var(--leading-13-16); }
.pef .pef__link { align-self: flex-start; }
.pef__ok { display: inline-flex; align-items: center; gap: 4px; margin: 0; color: var(--color-fill-color-3); font-size: var(--text-14-16); }
.pef__error { margin: 0; color: var(--color-fill-error); font-size: var(--text-14-16); line-height: var(--leading-14-16); }
/* панель сохранения: прилипает к низу экрана, пока есть несохранённые изменения */
.pef__bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; }
.pef__bar--dirty { position: sticky; bottom: calc(56px + env(safe-area-inset-bottom)); z-index: 5; margin-inline: -16px; padding: 12px 16px; border-top: var(--border-width) solid var(--color-stroke-gray); background: var(--color-background); }
.pef__actions { display: flex; flex: 1 1 100%; gap: 8px; }
.pef__actions > * { flex: 1; }
@media (min-width: 768px) {
  .pef { gap: 20px; }
  .pef__form { gap: 20px; }
  .pef__bar--dirty { margin-inline: 0; padding-inline: 0; }
  .pef__actions { flex: 0 0 auto; margin-inline-start: auto; }
  .pef__actions > * { flex: 0 0 auto; min-width: 160px; }
}
@media (min-width: 1380px) {
  .pef__bar--dirty { bottom: 0; }
}
</style>
