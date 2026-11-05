<script setup lang="ts">
import type { TicketMessage } from '~/types'
import { formatChatDay, formatClock, formatDay } from '~/utils/format'
import { categoryLabel, isOpenTicket, TICKET_MAX_FILES } from '~/utils/ticket'

/** Обращение: статус, переписка с поддержкой, ответ с вложениями, «Вопрос решён», переоткрытие (Договор, Прил. 1, п. 7.3) */
const props = defineProps<{ id: string }>()
const support = useSupportStore()
const files = useTicketFiles()

const t = computed(() => support.current)
const open = computed(() => (t.value ? isOpenTicket(t.value.status) : false))

watch(() => props.id, id => support.open(id), { immediate: true })
onBeforeUnmount(() => support.close())

const rows = computed(() => {
  const out: ({ kind: 'day', key: string, label: string } | { kind: 'msg', key: string, m: TicketMessage })[] = []
  let day = ''
  for (const m of support.messages) {
    const label = formatChatDay(m.createdAt)
    if (label !== day) { day = label; out.push({ kind: 'day', key: `day-${m.id}`, label }) }
    out.push({ kind: 'msg', key: m.id, m })
  }
  return out
})

const scroller = ref<HTMLElement>()
watch(() => support.messages.length, () => nextTick(() => { const el = scroller.value; if (el) el.scrollTop = el.scrollHeight }))

const draft = ref('')
const error = ref('')
const sending = ref(false)
const canSend = computed(() => open.value && !sending.value && (!!draft.value.trim() || files.count.value > 0))
async function send() {
  if (!canSend.value) return
  sending.value = true
  error.value = ''
  const err = await support.reply(draft.value.trim(), await files.payload())
  sending.value = false
  if (err) { error.value = tr(err); return }
  draft.value = ''
  files.clear()
}
async function resolve(resolved: boolean) {
  error.value = ''
  const err = await support.setResolved(resolved)
  if (err) error.value = tr(err)
}
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); send() }
}
const isImage = (type: string, url: string) => type.startsWith('image/') || url.startsWith('data:image/')
const textId = useId()
</script>

<template>
  <section class="tv">
    <CabinetPageHead :title="t ? `${tr('Обращение')} № ${t.number}` : tr('Обращение')" back="/profile/support" />

    <p v-if="support.ticketStatus === 'loading' && !t" class="tv__note" role="status">{{ tr('Загрузка...') }}</p>
    <p v-else-if="support.ticketStatus === 'error' && !t" class="tv__note" role="alert">
      {{ tr('Обращение не найдено.') }} <NuxtLink to="/profile/support">{{ tr('К списку обращений') }}</NuxtLink>
    </p>

    <template v-if="t">
      <header class="tv__head">
        <h2 class="tv__subject">{{ t.subject }}</h2>
        <div class="tv__meta">
          <TicketStatusBadge :status="t.status" />
          <span>{{ tr(categoryLabel(t.category)) }}</span>
          <span>{{ tr('Создано') }} {{ formatDay(t.createdAt) }}</span>
          <NuxtLink v-if="t.adId" :to="`/ad/${t.adId}`" class="tv__ad">{{ t.adTitle ?? tr('Объявление') }}</NuxtLink>
        </div>
      </header>

      <div ref="scroller" class="tv__feed" role="log" :aria-label="tr('Переписка с поддержкой')" aria-live="polite">
        <template v-for="r in rows" :key="r.key">
          <div v-if="r.kind === 'day'" class="tv__day">{{ r.label }}</div>
          <article v-else class="tv__msg" :class="{ 'tv__msg--mine': r.m.from === 'user' }">
            <p class="tv__author">{{ r.m.from === 'support' ? tr(r.m.authorName) : tr('Вы') }}</p>
            <p v-if="r.m.text" class="tv__text">{{ r.m.text }}</p>
            <ul v-if="r.m.attachments.length" class="tv__files">
              <li v-for="(a, i) in r.m.attachments" :key="i">
                <a :href="a.url" :download="a.name" target="_blank" rel="noopener">
                  <img v-if="isImage(a.type, a.url)" :src="a.url" :alt="a.name" class="tv__thumb">
                  <span v-else>{{ a.name }}</span>
                </a>
              </li>
            </ul>
            <time class="tv__time" :datetime="r.m.createdAt">{{ formatClock(r.m.createdAt) }}</time>
          </article>
        </template>
        <p v-if="open && t.status !== 'waiting' && support.messages.length < 2" class="tv__wait" role="status">{{ tr('Поддержка ответит здесь. Обычно в течение нескольких минут.') }}</p>
      </div>

      <form v-if="open" class="tv__reply" @submit.prevent="send">
        <label :for="textId" class="tv__sr">{{ tr('Ваш ответ') }}</label>
        <textarea :id="textId" v-model="draft" class="tv__input" rows="3" maxlength="3000" :placeholder="tr('Ваш ответ')" @keydown="onKey" />
        <KAttachFile :files="files.previews.value" :label="tr('Прикрепите файл')" :max="TICKET_MAX_FILES" accept="image/*,.pdf" @add="files.add" @remove="files.remove" />
        <p v-if="files.error.value" class="tv__error" role="alert">{{ files.error.value }}</p>
        <div class="tv__actions">
          <KButton type="submit" :disabled="!canSend">{{ sending ? tr('Отправка...') : tr('Отправить') }}</KButton>
          <KButton variant="outline" @click="resolve(true)">{{ tr('Вопрос решён') }}</KButton>
        </div>
      </form>

      <div v-else-if="t.status === 'resolved'" class="tv__done">
        <p class="tv__note">
          {{ tr('Обращение решено.') }}
          <template v-if="t.reopenUntil">{{ tr('Переоткрыть можно до {date}.', { date: formatDay(t.reopenUntil) }) }}</template>
        </p>
        <KButton variant="outline" @click="resolve(false)">{{ tr('Открыть снова') }}</KButton>
      </div>
      <div v-else class="tv__done">
        <p class="tv__note">{{ tr('Обращение закрыто. Если вопрос остался, создайте новое.') }}</p>
        <KButton variant="outline" to="/profile/support/new">{{ tr('Новое обращение') }}</KButton>
      </div>
      <p v-if="error" class="tv__error" role="alert">{{ error }}</p>
    </template>
  </section>
</template>

<style scoped>
.tv { display: flex; flex-direction: column; gap: 16px; max-width: 760px; }
.tv__head { display: flex; flex-direction: column; gap: 8px; }
.tv__subject { margin: 0; font-size: var(--text-17-20); line-height: var(--leading-17-20); font-weight: var(--font-weight-medium); overflow-wrap: anywhere; }
.tv__meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; color: var(--color-label-secondary); font-size: var(--text-13-16); }
.tv__ad { color: var(--color-fill-color-3); }
.tv__feed { display: flex; flex-direction: column; gap: 10px; max-height: 520px; padding: 12px; overflow-y: auto; border: var(--border-width) solid var(--color-stroke-gray); border-radius: var(--radius-md); background: var(--color-background); }
.tv__day { align-self: center; padding: 2px 10px; border-radius: var(--radius-pill); background: var(--color-fill-gray-3); color: var(--color-label-secondary); font-size: var(--text-12-12); }
.tv__msg { align-self: flex-start; display: flex; flex-direction: column; gap: 4px; max-width: min(86%, 560px); padding: 8px 12px; border-radius: 16px; border-end-start-radius: 4px; background: var(--color-fill-gray-3); }
.tv__msg--mine { align-self: flex-end; border-end-start-radius: 16px; border-end-end-radius: 4px; background: color-mix(in srgb, var(--color-fill-primary) 10%, var(--color-background)); }
.tv__author { margin: 0; color: var(--color-label-secondary); font-size: var(--text-12-12); font-weight: var(--font-weight-medium); }
.tv__text { margin: 0; font-size: var(--text-15-16); line-height: 21px; white-space: pre-wrap; overflow-wrap: anywhere; }
.tv__time { align-self: flex-end; color: var(--color-label-secondary); font-size: var(--text-12-12); }
.tv__files { display: flex; flex-wrap: wrap; gap: 6px; margin: 0; padding: 0; list-style: none; }
.tv__files a { color: var(--color-fill-color-3); font-size: var(--text-13-16); }
.tv__thumb { display: block; width: 96px; height: 72px; border-radius: var(--radius-sm); object-fit: cover; }
.tv__wait { align-self: center; margin: 0; color: var(--color-label-secondary); font-size: var(--text-13-16); text-align: center; }
.tv__reply { display: flex; flex-direction: column; gap: 10px; }
.tv__input { width: 100%; padding: 12px 16px; border: var(--border-width) solid var(--color-stroke-gray); border-radius: var(--radius-md); background: var(--color-background); color: var(--color-label-primary); font-family: inherit; font-size: var(--text-16-20); line-height: 22px; resize: vertical; }
.tv__input:focus { outline: none; border-color: var(--color-stroke-primary); }
.tv__actions { display: flex; flex-wrap: wrap; gap: 10px; }
.tv__done { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
.tv__note { margin: 0; color: var(--color-label-secondary); font-size: var(--text-14-16); line-height: 20px; }
.tv__note a { color: var(--color-fill-color-3); }
.tv__error { margin: 0; color: var(--color-fill-error); font-size: var(--text-13-16); }
.tv__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
</style>
