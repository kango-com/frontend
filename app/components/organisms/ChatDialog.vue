<script setup lang="ts">
import { formatChatDay, formatClock, formatPrice } from '~/utils/format'
import type { ChatItem } from '~/stores/chat'

/** Открытый диалог: собеседник и объявление, лента с разделителями по дням, блокировка, жалоба, отправка (Договор, Прил. 1, п. 7.2) */
const chat = useChatStore()
const auth = useAuthStore()

const d = computed(() => chat.current)
const me = computed(() => auth.user?.id)
const isMine = (m: ChatItem) => m.authorId === me.value || m.authorId === 'me'

// лента с разделителями дней
const rows = computed(() => {
  const out: ({ kind: 'day', key: string, label: string } | { kind: 'msg', key: string, m: ChatItem })[] = []
  let day = ''
  for (const m of chat.messages) {
    const label = formatChatDay(m.createdAt)
    if (label !== day) { day = label; out.push({ kind: 'day', key: `day-${m.id}`, label }) }
    out.push({ kind: 'msg', key: m.id, m })
  }
  return out
})

// прокрутка: к последнему сообщению при открытии и при новых, если пользователь и так внизу
const scroller = ref<HTMLElement>()
let stick = true
const onScroll = () => {
  const el = scroller.value
  if (el) stick = el.scrollHeight - el.scrollTop - el.clientHeight < 80
}
function toBottom(force = false) {
  nextTick(() => {
    const el = scroller.value
    if (el && (force || stick)) el.scrollTop = el.scrollHeight
  })
}
watch(() => chat.currentId, () => { stick = true })
watch(() => chat.messages.length, (n, old) => toBottom(!old))

const draft = ref('')
const composer = ref<{ focus: () => void }>()
async function send(text: string) {
  stick = true
  await chat.send(text)
  toBottom(true)
}
const retry = (m: ChatItem) => chat.send(m.text, m.id)

// подсказки для первого сообщения покупателя или соискателя
const QUICK = ['Здравствуйте! Объявление ещё актуально?', 'Когда можно посмотреть?', 'Возможен торг?']
function quick(text: string) {
  draft.value = tr(text)
  composer.value?.focus()
}

const canWrite = computed(() => !!d.value && !d.value.blockedByMe && !d.value.blockedMe && d.value.ad.status !== 'deleted')
const placeholder = computed(() => {
  if (!d.value) return undefined
  if (d.value.blockedMe) return tr('Пользователь ограничил переписку с вами')
  if (d.value.blockedByMe) return tr('Вы заблокировали этого пользователя')
  if (d.value.ad.status === 'deleted') return tr('Объявление удалено, переписка закрыта')
  return undefined
})

// блокировка с подтверждением, жалоба на сообщение
const confirmBlock = ref(false)
const blockError = ref('')
async function block() {
  confirmBlock.value = false
  reportId.value = null
  blockError.value = (await chat.setBlocked(true)) ? '' : tr('Не удалось заблокировать. Попробуйте ещё раз.')
}
async function unblock() {
  blockError.value = (await chat.setBlocked(false)) ? '' : tr('Не удалось разблокировать. Попробуйте ещё раз.')
}
const reportId = ref<string | null>(null)

const roleText = computed(() => (d.value?.role === 'author' ? tr('Пишет по вашему объявлению') : tr('Автор объявления')))
const AD_STATUS: Record<string, string> = { hidden: 'Снято с публикации', moderation: 'На модерации', rejected: 'Отклонено', deleted: 'Удалено' }
</script>

<template>
  <section class="cdlg" :aria-label="d ? tr('Диалог с {name}', { name: d.peer.name }) : tr('Диалог')">
    <header class="cdlg__head">
      <NuxtLink to="/messages" class="cdlg__back" :aria-label="tr('К списку диалогов')">
        <Icon name="kango:arrow-left-24" size="24" />
      </NuxtLink>
      <template v-if="d">
        <UserAvatar :name="d.peer.name" :src="d.peer.avatarUrl" :size="40" />
        <div class="cdlg__who">
          <span class="cdlg__name">{{ d.peer.name }}</span>
          <span class="cdlg__role">
            <template v-if="d.peer.online"><span class="cdlg__dot" />{{ tr('В сети') }} · </template>{{ roleText }}
          </span>
        </div>
        <KTextButton v-if="!d.blockedByMe" size="sm" class="cdlg__block" @click="confirmBlock = true">{{ tr('Заблокировать') }}</KTextButton>
      </template>
    </header>

    <NuxtLink v-if="d" :to="`/ad/${d.ad.id}`" class="cdlg__ad">
      <img v-if="d.ad.image" :src="d.ad.image" alt="" class="cdlg__ad-img">
      <span v-else class="cdlg__ad-img" aria-hidden="true" />
      <span class="cdlg__ad-text">
        <span class="cdlg__ad-title">{{ d.ad.title }}</span>
        <span class="cdlg__ad-price">
          <template v-if="d.ad.status !== 'deleted'">{{ formatPrice(d.ad.price) }}</template>
          <span v-if="AD_STATUS[d.ad.status]" class="cdlg__ad-status">{{ tr(AD_STATUS[d.ad.status]!) }}</span>
        </span>
      </span>
      <Icon name="kango:chevron-right-20" size="20" class="cdlg__chevron" />
    </NuxtLink>

    <div ref="scroller" class="cdlg__feed" role="log" aria-live="polite" :aria-busy="chat.dialogStatus === 'loading'" @scroll.passive="onScroll">
      <p v-if="chat.dialogStatus === 'loading' && !chat.messages.length" class="cdlg__note">{{ tr('Загрузка...') }}</p>
      <p v-else-if="chat.dialogStatus === 'error'" class="cdlg__note" role="alert">
        {{ tr('Не удалось загрузить переписку.') }}
        <KTextButton size="sm" @click="chat.currentId && chat.select(chat.currentId)">{{ tr('Повторить') }}</KTextButton>
      </p>
      <div v-else-if="!chat.messages.length && d" class="cdlg__empty">
        <p>{{ d.role === 'client' ? tr('Напишите автору: спросите о деталях или договоритесь о встрече.') : tr('Сообщений пока нет.') }}</p>
        <div v-if="d.role === 'client' && canWrite" class="cdlg__quick">
          <button v-for="q in QUICK" :key="q" type="button" class="cdlg__chip" @click="quick(q)">{{ tr(q) }}</button>
        </div>
      </div>
      <template v-for="r in rows" :key="r.key">
        <p v-if="r.kind === 'day'" class="cdlg__day"><span>{{ r.label }}</span></p>
        <ChatBubble
          v-else
          :text="r.m.text"
          :time="formatClock(r.m.createdAt)"
          :mine="isMine(r.m)"
          :read="r.m.read"
          :state="r.m.state"
          :reportable="!isMine(r.m)"
          @retry="retry(r.m)"
          @discard="chat.removeFailed(r.m.id)"
          @report="reportId = r.m.id"
        />
      </template>
    </div>

    <div v-if="d?.blockedByMe" class="cdlg__banner" role="status">
      <span>{{ tr('Вы заблокировали пользователя. Он не может вам писать.') }}</span>
      <KTextButton size="sm" @click="unblock">{{ tr('Разблокировать') }}</KTextButton>
    </div>
    <p v-if="blockError || chat.sendError" class="cdlg__error" role="alert">{{ blockError || chat.sendError }}</p>

    <ChatComposer ref="composer" v-model="draft" class="cdlg__composer" :disabled="!canWrite" :placeholder="placeholder" @send="send" />

    <KModalSheet v-model="confirmBlock" :title="tr('Заблокировать пользователя?')" dialog>
      <div class="cdlg__confirm">
        <p>{{ tr('{name} не сможет писать вам. Разблокировать можно в этом же диалоге.', { name: d?.peer.name ?? '' }) }}</p>
        <KButton block @click="block">{{ tr('Заблокировать') }}</KButton>
        <KButton block variant="outline" @click="confirmBlock = false">{{ tr('Отмена') }}</KButton>
      </div>
    </KModalSheet>
    <MessageReportDialog :message-id="reportId" @close="reportId = null" @block="block" />
  </section>
</template>

<style scoped>
.cdlg { display: flex; flex-direction: column; min-height: 0; height: 100%; background: var(--color-background); }
.cdlg__head { display: flex; align-items: center; gap: 10px; min-height: 56px; padding: 6px 12px 6px 4px; border-bottom: var(--border-width) solid var(--color-separator-gray); }
.cdlg .cdlg__back { display: inline-flex; flex: none; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: var(--radius-md); color: var(--color-label-primary); }
[dir='rtl'] .cdlg__back { transform: scaleX(-1); }
.cdlg__back:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: -2px; }
.cdlg__who { display: flex; flex: 1; flex-direction: column; gap: 2px; min-width: 0; }
.cdlg__name { overflow: hidden; font-size: var(--text-16-20); line-height: var(--leading-16-20); font-weight: var(--font-weight-medium); text-overflow: ellipsis; white-space: nowrap; }
.cdlg__role { overflow: hidden; color: var(--color-label-secondary); font-size: var(--text-12-16); line-height: var(--leading-12-16); text-overflow: ellipsis; white-space: nowrap; }
.cdlg__dot { display: inline-block; width: 8px; height: 8px; margin-inline-end: 4px; border-radius: 50%; background: #22a861; }
.cdlg .cdlg__block { flex: none; color: var(--color-label-secondary); }

.cdlg .cdlg__ad { display: flex; align-items: center; gap: 10px; padding: 8px 16px; border-bottom: var(--border-width) solid var(--color-separator-gray); background: var(--color-fill-gray-4); color: inherit; text-decoration: none; }
.cdlg__ad:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: -2px; }
.cdlg__ad-img { flex: none; width: 40px; height: 40px; border-radius: var(--radius-sm); background: var(--color-fill-gray-3); object-fit: cover; }
.cdlg__ad-text { display: flex; flex: 1; flex-direction: column; gap: 2px; min-width: 0; }
.cdlg__ad-title { overflow: hidden; font-size: var(--text-14-16); line-height: var(--leading-14-16); text-overflow: ellipsis; white-space: nowrap; }
.cdlg__ad-price { display: flex; gap: 8px; font-size: var(--text-14-16); font-weight: var(--font-weight-medium); }
.cdlg__ad-status { color: var(--color-fill-error); font-weight: var(--font-weight-regular); }
.cdlg__chevron { flex: none; color: var(--color-label-gray); }
[dir='rtl'] .cdlg__chevron { transform: scaleX(-1); }

.cdlg__feed { display: flex; flex: 1; flex-direction: column; gap: 6px; min-height: 0; padding: 12px 16px 16px; overflow-y: auto; overscroll-behavior: contain; }
.cdlg__day { display: flex; justify-content: center; margin: 10px 0 4px; }
.cdlg__day span { padding: 3px 10px; border-radius: var(--radius-pill); background: var(--color-fill-gray-3); color: var(--color-label-secondary); font-size: var(--text-12-16); }
.cdlg__note { margin: auto; color: var(--color-label-secondary); text-align: center; }
.cdlg__empty { display: flex; flex-direction: column; align-items: center; gap: 12px; margin: auto; max-width: 360px; text-align: center; }
.cdlg__empty p { margin: 0; color: var(--color-label-secondary); line-height: 20px; }
.cdlg__quick { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.cdlg__chip { padding: 8px 12px; border: var(--border-width) solid var(--color-stroke-gray); border-radius: var(--radius-pill); background: var(--color-background); color: var(--color-label-primary); font-family: inherit; font-size: var(--text-14-16); cursor: pointer; }
.cdlg__chip:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
@media (hover: hover) {
  .cdlg__chip:hover { border-color: var(--color-stroke-primary); }
}

.cdlg__banner { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 4px 12px; padding: 10px 16px; background: var(--color-fill-gray-4); font-size: var(--text-14-16); line-height: 20px; }
.cdlg__error { margin: 0; padding: 6px 16px 0; color: var(--color-fill-error); font-size: var(--text-13-16); }
.cdlg__composer { padding: 8px 12px calc(8px + env(safe-area-inset-bottom)); border-top: var(--border-width) solid var(--color-separator-gray); }
.cdlg__confirm { display: flex; flex-direction: column; gap: 8px; }
.cdlg__confirm p { margin: 0 0 8px; color: var(--color-label-secondary); line-height: 20px; }
@media (min-width: 768px) {
  .cdlg__back { display: none !important; }
  .cdlg__head { padding-inline-start: 16px; }
}
</style>
