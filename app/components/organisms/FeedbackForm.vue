<script setup lang="ts">
import { contentApi, isApiError, toApiError } from '~/api'
import type { AttachedFile } from '~/components/molecules/KAttachFile.vue'
import { isEmail } from '~/utils/password'

/** Форма «Напишите нам»: имя, e-mail, сообщение, файл. Успех и ошибки показываются на месте. */
const name = ref('')
const email = ref('')
const message = ref('')
const file = ref<File | null>(null)
const preview = ref<AttachedFile[]>([])
const errors = reactive<{ name?: string, email?: string, message?: string, form?: string }>({})
const status = ref<'idle' | 'sending' | 'sent'>('idle')
const messageId = useId()

function attach(files: File[]) {
  const f = files[0]
  if (!f) return
  file.value = f
  preview.value = [{ id: f.name, url: URL.createObjectURL(f), name: f.name }]
}
function detach() {
  preview.value.forEach(p => URL.revokeObjectURL(p.url))
  file.value = null
  preview.value = []
}
onBeforeUnmount(detach)

function validate() {
  errors.name = !name.value.trim() ? 'Заполните поля' : undefined
  errors.email = !email.value.trim() ? 'Заполните поля' : !isEmail(email.value) ? 'Введите корректный e-mail' : undefined
  errors.message = !message.value.trim() ? 'Заполните поля' : undefined
  return !errors.name && !errors.email && !errors.message
}

async function submit() {
  errors.form = undefined
  if (!validate()) return
  status.value = 'sending'
  try {
    await contentApi.feedback({ name: name.value.trim(), email: email.value.trim(), message: message.value.trim(), attachment: file.value })
    status.value = 'sent'
    name.value = email.value = message.value = ''
    detach()
  } catch (e) {
    status.value = 'idle'
    const err = isApiError(e) ? e : toApiError(e)
    errors.name = err.fields?.name
    errors.email = err.fields?.email
    errors.message = err.fields?.message
    if (!err.fields) errors.form = err.message
  }
}
</script>

<template>
  <section class="fbk" aria-labelledby="fbk-title">
    <h2 id="fbk-title" class="fbk__title">Напишите нам</h2>

    <div v-if="status === 'sent'" class="fbk__done" role="status">
      <p>Спасибо! Сообщение отправлено, мы ответим на указанную почту.</p>
      <KButton variant="outline" @click="status = 'idle'">Написать ещё</KButton>
    </div>

    <form v-else class="fbk__form" novalidate @submit.prevent="submit">
      <KTextField v-model="name" placeholder="Имя" autocomplete="name" :error="errors.name" />
      <KTextField v-model="email" type="email" placeholder="Email" autocomplete="email" :error="errors.email" />
      <div class="fbk__msg">
        <label :for="messageId" class="fbk__label">Сообщение</label>
        <textarea :id="messageId" v-model="message" class="fbk__text" :class="{ 'fbk__text--error': errors.message }" rows="5" :aria-invalid="!!errors.message" />
        <p v-if="errors.message" class="fbk__error" role="alert">{{ errors.message }}</p>
      </div>
      <KAttachFile :files="preview" label="Прикрепите файл" :multiple="false" @add="attach" @remove="detach" />
      <p v-if="errors.form" class="fbk__error" role="alert">{{ errors.form }}</p>
      <KButton block type="submit" :disabled="status === 'sending'">{{ status === 'sending' ? 'Отправка...' : 'Отправить' }}</KButton>
      <p class="fbk__policy">
        Нажимая «Отправить», вы соглашаетесь с
        <KTextButton to="/documents/privacy" size="sm" underline>политикой обработки данных</KTextButton>
      </p>
    </form>
  </section>
</template>

<style scoped>
.fbk { display: flex; flex-direction: column; gap: 16px; }
.fbk__title { margin: 0; font-size: var(--text-20-20); line-height: var(--leading-20-20); font-weight: var(--font-weight-medium); }
.fbk__form { display: flex; flex-direction: column; gap: 12px; }
.fbk__msg { display: flex; flex-direction: column; gap: 6px; }
.fbk__label { color: var(--color-label-primary); font-size: var(--text-16-20); font-weight: var(--font-weight-medium); }
.fbk__text { width: 100%; padding: 12px 16px; border: var(--border-width) solid var(--color-stroke-gray); border-radius: var(--radius-md); color: var(--color-label-primary); font-family: inherit; font-size: var(--text-16-20); resize: vertical; }
.fbk__text:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 1px; }
.fbk__text--error { border-color: var(--color-fill-error); }
.fbk__error { margin: 0; color: var(--color-fill-error); font-size: var(--text-12-16); line-height: var(--leading-12-16); }
.fbk__policy { margin: 0; color: var(--color-label-secondary); font-size: var(--text-12-16); line-height: var(--leading-12-16); text-align: center; }
.fbk__done { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; padding: 16px; border-radius: var(--radius-md); background: var(--color-fill-tint); }
.fbk__done p { margin: 0; }
</style>
