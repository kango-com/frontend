<script setup lang="ts">
import { contentApi, isApiError, toApiError } from '~/api'
import type { AttachedFile } from '~/components/molecules/KAttachFile.vue'
import { isEmail } from '~/utils/password'

/** Форма «Напишите нам»: имя, e-mail, сообщение, файл. Успех и ошибки показываются на месте. */
const name = ref('')
const email = ref('')
const phone = ref('')
const agree = ref(false)
const message = ref('')
const file = ref<File | null>(null)
const preview = ref<AttachedFile[]>([])
const errors = reactive<{ name?: string, email?: string, message?: string, agree?: string, form?: string }>({})
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
  errors.name = !name.value.trim() ? tr('Заполните поля') : undefined
  errors.email = !email.value.trim() ? tr('Заполните поля') : !isEmail(email.value) ? tr('Введите корректный e-mail') : undefined
  errors.message = !message.value.trim() ? tr('Заполните поля') : undefined
  errors.agree = agree.value ? undefined : tr('Подтвердите согласие с политикой')
  return !errors.name && !errors.email && !errors.message && !errors.agree
}

async function submit() {
  errors.form = undefined
  if (!validate()) return
  status.value = 'sending'
  try {
    await contentApi.feedback({ name: name.value.trim(), email: email.value.trim(), phone: phone.value.trim() || undefined, message: message.value.trim(), attachment: file.value })
    status.value = 'sent'
    name.value = email.value = phone.value = message.value = ''
    agree.value = false
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
    <h2 id="fbk-title" class="fbk__title">{{ tr('Напишите нам') }}</h2>

    <div v-if="status === 'sent'" class="fbk__done" role="status">
      <p>{{ tr('Спасибо! Сообщение отправлено, мы ответим на указанную почту.') }}</p>
      <KButton variant="outline" @click="status = 'idle'">{{ tr('Написать ещё') }}</KButton>
    </div>

    <form v-else class="fbk__form" novalidate @submit.prevent="submit">
      <KTextField v-model="name" :placeholder="tr('Имя')" autocomplete="name" :error="errors.name" />
      <KTextField v-model="email" type="email" placeholder="E-mail" autocomplete="email" :error="errors.email" />
      <KTextField v-model="phone" type="tel" :placeholder="tr('Телефон')" autocomplete="tel" />
      <div class="fbk__msg">
        <textarea :id="messageId" v-model="message" class="fbk__text" :class="{ 'fbk__text--error': errors.message }" rows="3" :placeholder="tr('Какой вопрос?')" :aria-label="tr('Какой вопрос?')" :aria-invalid="!!errors.message" />
        <p v-if="errors.message" class="fbk__error" role="alert">{{ errors.message }}</p>
      </div>
      <KAttachFile :files="preview" :label="tr('Прикрепите файл')" :multiple="false" @add="attach" @remove="detach" />
      <p v-if="errors.form" class="fbk__error" role="alert">{{ errors.form }}</p>
      <div class="fbk__agree">
        <KCheckbox v-model="agree">
          {{ tr('Нажимая «Отправить», вы соглашаетесь с') }} <NuxtLink to="/documents/privacy" class="fbk__link" @click.stop>{{ tr('политикой обработки данных') }}</NuxtLink>
        </KCheckbox>
        <p v-if="errors.agree" class="fbk__error" role="alert">{{ errors.agree }}</p>
      </div>
      <KButton block type="submit" :disabled="status === 'sending'">{{ status === 'sending' ? tr('Отправка...') : tr('Отправить') }}</KButton>
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
.fbk__agree { display: flex; flex-direction: column; gap: 4px; font-size: var(--text-12-16); line-height: var(--leading-12-16); color: var(--color-label-secondary); }
.fbk__link { color: var(--color-label-primary); text-decoration: underline; }
.fbk__policy { margin: 0; color: var(--color-label-secondary); font-size: var(--text-12-16); line-height: var(--leading-12-16); text-align: center; }
.fbk__done { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; padding: 16px; border-radius: var(--radius-md); background: var(--color-fill-tint); }
.fbk__done p { margin: 0; }
</style>
