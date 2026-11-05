<script setup lang="ts">
import type { MessageReportReason } from '~/types'

/** Жалоба на сообщение в чате: причина, комментарий; после отправки - предложение заблокировать собеседника */
const props = defineProps<{ messageId: string | null }>()
const emit = defineEmits<{ close: [], block: [] }>()
const chat = useChatStore()

const REASONS: { value: MessageReportReason, label: string }[] = [
  { value: 'spam', label: 'Спам или реклама' },
  { value: 'fraud', label: 'Мошенничество' },
  { value: 'insult', label: 'Оскорбления или угрозы' },
  { value: 'other', label: 'Другое' }
]

const reason = ref<MessageReportReason | ''>('')
const comment = ref('')
const status = ref<'idle' | 'sending' | 'done' | 'error'>('idle')
const error = ref('')
const commentId = useId()

watch(() => props.messageId, (v) => {
  if (v) { reason.value = ''; comment.value = ''; status.value = 'idle'; error.value = '' }
})

async function send() {
  if (!props.messageId) return
  if (!reason.value) { error.value = tr('Выберите причину'); return }
  error.value = ''
  status.value = 'sending'
  try {
    await chat.report(props.messageId, reason.value, comment.value.trim() || undefined)
    status.value = 'done'
  } catch {
    status.value = 'error'
    error.value = tr('Не удалось отправить жалобу. Попробуйте ещё раз.')
  }
}
</script>

<template>
  <KModalSheet :model-value="!!messageId" :title="tr('Пожаловаться на сообщение')" dialog @update:model-value="v => { if (!v) emit('close') }">
    <div v-if="status === 'done'" class="mrep__done" role="status">
      <p>{{ tr('Спасибо, жалоба отправлена модератору.') }}</p>
      <p v-if="!chat.current?.blockedByMe" class="mrep__hint">{{ tr('Если не хотите получать сообщения от этого пользователя, заблокируйте его.') }}</p>
      <KButton v-if="!chat.current?.blockedByMe" block variant="outline" @click="emit('block')">{{ tr('Заблокировать пользователя') }}</KButton>
      <KButton block @click="emit('close')">{{ tr('Закрыть') }}</KButton>
    </div>

    <form v-else class="mrep" novalidate @submit.prevent="send">
      <fieldset class="mrep__reasons">
        <legend class="mrep__legend">{{ tr('Причина жалобы') }}</legend>
        <KTableRow v-for="r in REASONS" :key="r.value" v-model="reason" type="radio" name="message-report-reason" :value="r.value" :label="tr(r.label)" />
      </fieldset>
      <label :for="commentId" class="mrep__legend">{{ tr('Комментарий (необязательно)') }}</label>
      <textarea :id="commentId" v-model="comment" class="mrep__text" rows="3" maxlength="500" />
      <p v-if="error" class="mrep__error" role="alert">{{ error }}</p>
      <KButton block type="submit" :disabled="status === 'sending'">{{ status === 'sending' ? tr('Отправка...') : tr('Отправить') }}</KButton>
    </form>
  </KModalSheet>
</template>

<style scoped>
.mrep { display: flex; flex-direction: column; gap: 12px; }
.mrep__reasons { margin: 0; padding: 0; border: 0; }
.mrep__legend { padding: 0; color: var(--color-label-primary); font-size: var(--text-16-20); line-height: var(--leading-16-20); font-weight: var(--font-weight-medium); }
.mrep__text { width: 100%; padding: 12px 16px; border: var(--border-width) solid var(--color-stroke-gray); border-radius: var(--radius-md); color: var(--color-label-primary); font-family: inherit; font-size: var(--text-16-20); resize: vertical; }
.mrep__text:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 1px; }
.mrep__error { margin: 0; color: var(--color-fill-error); font-size: var(--text-14-16); }
.mrep__done { display: flex; flex-direction: column; gap: 12px; }
.mrep__done p { margin: 0; font-size: var(--text-16-20); line-height: var(--leading-16-20); }
.mrep__done .mrep__hint { color: var(--color-label-secondary); font-size: var(--text-14-16); line-height: 20px; }
</style>
