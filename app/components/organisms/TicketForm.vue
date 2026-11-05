<script setup lang="ts">
import type { TicketCategory } from '~/types'
import { TICKET_CATEGORIES, TICKET_MAX_FILES } from '~/utils/ticket'

/** Новое обращение: тема, категория, описание, вложения, привязка своего объявления (Договор, Прил. 1, п. 7.3) */
const support = useSupportStore()
const mine = useMyAdsStore()
const route = useRoute()
const files = useTicketFiles()

const CATS = TICKET_CATEGORIES.map(c => c.value)
const qCat = String(route.query.category ?? '')
const subject = ref('')
const category = ref<TicketCategory | ''>(CATS.includes(qCat as TicketCategory) ? (qCat as TicketCategory) : '')
const adId = ref(typeof route.query.ad === 'string' ? route.query.ad : '')
const text = ref('')
const errors = reactive<{ subject?: string, category?: string, text?: string, adId?: string, form?: string }>({})
const sending = ref(false)
const textId = useId()
const MAX_TEXT = 3000

onMounted(() => { if (mine.status === 'idle') mine.load() })
const categoryOptions = computed(() => TICKET_CATEGORIES.map(c => ({ value: c.value, label: tr(c.label) })))
const adOptions = computed(() => [{ value: '', label: tr('Без привязки') }, ...mine.items.map(a => ({ value: a.id, label: a.title }))])

function validate() {
  errors.subject = subject.value.trim() ? undefined : tr('Укажите тему')
  errors.category = category.value ? undefined : tr('Выберите категорию')
  errors.text = !text.value.trim() ? tr('Опишите вопрос') : text.value.length > MAX_TEXT ? tr('Не больше 3000 символов') : undefined
  return !errors.subject && !errors.category && !errors.text
}

async function submit() {
  errors.form = undefined
  if (sending.value || !validate()) return
  sending.value = true
  const r = await support.create({
    subject: subject.value.trim(),
    category: category.value as TicketCategory,
    text: text.value.trim(),
    adId: adId.value || undefined,
    attachments: await files.payload()
  })
  sending.value = false
  if ('id' in r) {
    files.clear()
    await navigateTo(`/profile/support/${r.id}`)
    return
  }
  errors.subject = r.fields?.subject ? tr(r.fields.subject) : undefined
  errors.category = r.fields?.category ? tr(r.fields.category) : undefined
  errors.text = r.fields?.text ? tr(r.fields.text) : undefined
  errors.adId = r.fields?.adId ? tr(r.fields.adId) : undefined
  if (!r.fields) errors.form = tr(r.error)
}
</script>

<template>
  <section class="tfm">
    <CabinetPageHead :title="tr('Новое обращение')" back="/profile/support" />
    <CabinetCard :title="tr('Опишите вопрос')" :description="tr('Ответим здесь, в кабинете. Если вопрос про объявление, привяжите его.')">
      <form class="tfm__form" novalidate @submit.prevent="submit">
        <KTextField v-model="subject" :label="tr('Тема')" :placeholder="tr('Тема')" :error="errors.subject" maxlength="120" />
        <KSelect v-model="category" :options="categoryOptions" :placeholder="tr('Категория')" :label="tr('Категория')" :error="!!errors.category" />
        <p v-if="errors.category" class="tfm__error" role="alert">{{ errors.category }}</p>
        <template v-if="mine.items.length">
          <KSelect v-model="adId" :options="adOptions" :placeholder="tr('Объявление (необязательно)')" :label="tr('Объявление (необязательно)')" :error="!!errors.adId" />
          <p v-if="errors.adId" class="tfm__error" role="alert">{{ errors.adId }}</p>
        </template>
        <div class="tfm__area">
          <label :for="textId" class="tfm__label">{{ tr('Описание') }}</label>
          <textarea :id="textId" v-model="text" class="tfm__text" :class="{ 'tfm__text--error': errors.text }" rows="6" :maxlength="MAX_TEXT + 100" :aria-invalid="!!errors.text" />
          <p v-if="errors.text" class="tfm__error" role="alert">{{ errors.text }}</p>
          <p v-else class="tfm__hint">{{ text.length }} / {{ MAX_TEXT }}</p>
        </div>
        <KAttachFile :files="files.previews.value" :label="tr('Прикрепите файл')" :max="TICKET_MAX_FILES" accept="image/*,.pdf" @add="files.add" @remove="files.remove" />
        <p v-if="files.error.value" class="tfm__error" role="alert">{{ files.error.value }}</p>
        <p v-if="errors.form" class="tfm__error" role="alert">{{ errors.form }}</p>
        <KButton type="submit" :disabled="sending" block>{{ sending ? tr('Отправка...') : tr('Отправить') }}</KButton>
      </form>
    </CabinetCard>
  </section>
</template>

<style scoped>
.tfm { display: flex; flex-direction: column; gap: 16px; max-width: 760px; }
.tfm__form { display: flex; flex-direction: column; gap: 14px; }
.tfm__area { display: flex; flex-direction: column; gap: 6px; }
.tfm__label { color: var(--color-label-secondary); font-size: var(--text-14-16); }
.tfm__text { width: 100%; padding: 12px 16px; border: var(--border-width) solid var(--color-stroke-gray); border-radius: var(--radius-md); background: var(--color-background); color: var(--color-label-primary); font-family: inherit; font-size: var(--text-16-20); line-height: 22px; resize: vertical; }
.tfm__text:focus { outline: none; border-color: var(--color-stroke-primary); }
.tfm__text--error { border-color: var(--color-fill-error); }
.tfm__hint { margin: 0; color: var(--color-label-secondary); font-size: var(--text-12-12); text-align: end; }
.tfm__error { margin: 0; color: var(--color-fill-error); font-size: var(--text-13-16); line-height: 18px; }
@media (min-width: 768px) {
  .tfm { gap: 20px; }
}
</style>
