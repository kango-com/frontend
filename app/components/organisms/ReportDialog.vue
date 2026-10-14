<script setup lang="ts">
import type { ReportReason } from '~/types'

const props = defineProps<{ adId: string }>()

const open = defineModel<boolean>({ default: false })
const ads = useAdsStore()

const REASONS: { value: ReportReason, label: string }[] = [
  { value: 'spam', label: 'Спам или реклама' },
  { value: 'fraud', label: 'Мошенничество' },
  { value: 'wrong-section', label: 'Неверный раздел или категория' },
  { value: 'prohibited', label: 'Запрещённый товар или услуга' },
  { value: 'other', label: 'Другое' }
]

const reason = ref<ReportReason | ''>('')
const comment = ref('')
const status = ref<'idle' | 'sending' | 'done' | 'error'>('idle')
const error = ref('')
const commentId = useId()

watch(open, (v) => {
  if (v) { reason.value = ''; comment.value = ''; status.value = 'idle'; error.value = '' }
})

async function send() {
  if (!reason.value) { error.value = tr('Выберите причину'); return }
  error.value = ''
  status.value = 'sending'
  try {
    await ads.report(props.adId, { reason: reason.value, comment: comment.value.trim() || undefined })
    status.value = 'done'
  } catch {
    status.value = 'error'
    error.value = tr('Не удалось отправить жалобу. Попробуйте ещё раз.')
  }
}
</script>

<template>
  <KModalSheet v-model="open" :title="tr('Пожаловаться')" dialog>
    <div v-if="status === 'done'" class="rep__done" role="status">
      <p>{{ tr('Спасибо, жалоба отправлена. Мы проверим объявление.') }}</p>
      <KButton block @click="open = false">{{ tr('Закрыть') }}</KButton>
    </div>

    <form v-else class="rep" novalidate @submit.prevent="send">
      <fieldset class="rep__reasons">
        <legend class="rep__legend">{{ tr('Причина жалобы') }}</legend>
        <KTableRow v-for="r in REASONS" :key="r.value" v-model="reason" type="radio" name="report-reason" :value="r.value" :label="tr(r.label)" />
      </fieldset>
      <label :for="commentId" class="rep__label">{{ tr('Комментарий (необязательно)') }}</label>
      <textarea :id="commentId" v-model="comment" class="rep__text" rows="3" maxlength="500" />
      <p v-if="error" class="rep__error" role="alert">{{ error }}</p>
      <KButton block type="submit" :disabled="status === 'sending'">{{ status === 'sending' ? tr('Отправка...') : tr('Отправить') }}</KButton>
    </form>
  </KModalSheet>
</template>

<style scoped>
.rep { display: flex; flex-direction: column; gap: 12px; }
.rep__reasons { margin: 0; padding: 0; border: 0; }
.rep__legend, .rep__label { padding: 0; color: var(--color-label-primary); font-size: var(--text-16-20); line-height: var(--leading-16-20); font-weight: var(--font-weight-medium); }
.rep__text {
  width: 100%;
  padding: 12px 16px;
  border: var(--border-width) solid var(--color-stroke-gray);
  border-radius: var(--radius-md);
  color: var(--color-label-primary);
  font-family: inherit;
  font-size: var(--text-16-20);
  resize: vertical;
}
.rep__text:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 1px; }
.rep__error { margin: 0; color: var(--color-fill-error); font-size: var(--text-14-16); }
.rep__done { display: flex; flex-direction: column; gap: 16px; }
.rep__done p { margin: 0; font-size: var(--text-16-20); line-height: var(--leading-16-20); }
</style>
