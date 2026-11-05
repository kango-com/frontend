<script setup lang="ts">
import { formatChatTime } from '~/utils/format'

/**
 * Раздел «Сообщения»: список диалогов и открытый диалог.
 * На телефоне - что-то одно (диалог на весь экран поверх шапки и таббара), с планшета - две колонки.
 */
const props = defineProps<{ dialogId?: string }>()
const chat = useChatStore()
const auth = useAuthStore()


watch(() => props.dialogId, (id) => {
  if (id) chat.select(id)
  else if (chat.currentId) chat.close()
  // список обновляем при каждом переходе: в нём меняются непрочитанные
  chat.loadList()
}, { immediate: true })
// закрываем только свой диалог: при смене страницы новый экран может успеть открыть другой раньше, чем уберут этот
onBeforeUnmount(() => { if (props.dialogId && chat.currentId === props.dialogId) chat.close() })

// фильтр списка по имени собеседника и названию объявления
const query = ref('')
const list = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return chat.dialogs
  return chat.dialogs.filter(d => d.peer.name.toLowerCase().includes(q) || d.ad.title.toLowerCase().includes(q))
})
const unreadOnly = ref(false)
const shown = computed(() => (unreadOnly.value ? list.value.filter(d => d.unread) : list.value))
</script>

<template>
  <div class="chv" :class="{ 'chv--open': !!dialogId }">
    <section class="chv__list" :aria-label="tr('Диалоги')">
      <CabinetPageHead :title="tr('Сообщения')" />
      <div v-if="chat.dialogs.length" class="chv__tools">
        <KSearchField v-model="query" :placeholder="tr('Поиск по имени или объявлению')" />
        <div class="chv__filter" role="group" :aria-label="tr('Показать')">
          <button type="button" class="chv__f" :aria-pressed="!unreadOnly" @click="unreadOnly = false">{{ tr('Все') }}</button>
          <button type="button" class="chv__f" :aria-pressed="unreadOnly" @click="unreadOnly = true">
            {{ tr('Непрочитанные') }}<template v-if="chat.unreadTotal"> · {{ chat.unreadTotal }}</template>
          </button>
        </div>
      </div>

      <p v-if="chat.listStatus === 'loading'" class="chv__note" aria-busy="true">{{ tr('Загрузка...') }}</p>
      <p v-else-if="chat.listStatus === 'error'" class="chv__note" role="alert">
        {{ tr('Не удалось загрузить диалоги.') }} <KTextButton size="sm" @click="chat.loadList()">{{ tr('Повторить') }}</KTextButton>
      </p>
      <div v-else-if="!chat.dialogs.length && chat.listStatus === 'success'" class="chv__empty">
        <Icon name="kango:message-24" size="32" class="chv__empty-icon" />
        <p class="chv__empty-title">{{ tr('Сообщений пока нет') }}</p>
        <p>{{ tr('Напишите автору со страницы объявления - диалог появится здесь.') }}</p>
        <KButton to="/" variant="outline">{{ tr('Перейти к объявлениям') }}</KButton>
      </div>
      <p v-else-if="!shown.length" class="chv__note">{{ unreadOnly ? tr('Непрочитанных нет.') : tr('Ничего не найдено.') }}</p>
      <ul v-else class="chv__items">
        <li v-for="d in shown" :key="d.id">
          <ChatListItem
            :to="`/messages/${d.id}`"
            :name="d.peer.name"
            :avatar-url="d.peer.avatarUrl"
            :online="d.peer.online"
            :ad-title="d.ad.title"
            :ad-image="d.ad.image"
            :preview="d.lastMessage?.text"
            :mine="d.lastMessage?.authorId === auth.user?.id"
            :time="d.lastMessage ? formatChatTime(d.lastMessage.createdAt) : undefined"
            :unread="d.unread"
            :active="d.id === dialogId"
            :blocked="d.blockedByMe"
          />
        </li>
      </ul>
    </section>

    <div class="chv__pane">
      <ChatDialog v-if="dialogId" />
      <div v-else class="chv__placeholder">
        <Icon name="kango:message-24" size="40" />
        <p>{{ tr('Выберите диалог слева') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chv { display: flex; flex-direction: column; }
.chv__list { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.chv__tools { display: flex; flex-direction: column; gap: 10px; }
.chv__filter { display: flex; gap: 8px; }
.chv__f { height: 32px; padding: 0 12px; border: var(--border-width) solid var(--color-stroke-gray); border-radius: var(--radius-pill); background: var(--color-background); color: var(--color-label-primary); font-family: inherit; font-size: var(--text-14-16); cursor: pointer; }
.chv__f[aria-pressed='true'] { border-color: var(--color-label-primary); background: var(--color-label-primary); color: var(--color-label-white); }
.chv__f:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
.chv__items { display: flex; flex-direction: column; margin: 0 -12px; padding: 0; list-style: none; }
.chv__note { margin: 0; color: var(--color-label-secondary); }
.chv__empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 40px 16px; text-align: center; }
.chv__empty p { margin: 0; max-width: 320px; color: var(--color-label-secondary); line-height: 20px; }
.chv__empty .chv__empty-title { color: var(--color-label-primary); font-size: var(--text-17-20); font-weight: var(--font-weight-medium); }
.chv__empty-icon { color: var(--color-label-gray); }
.chv__empty > :last-child { margin-top: 8px; }
.chv__pane { display: none; }

/* телефон: открытый диалог - на весь экран поверх шапки и таббара */
@media (max-width: 767px) {
  .chv--open .chv__list { display: none; }
  .chv--open .chv__pane { position: fixed; inset: 0; z-index: 70; display: flex; flex-direction: column; height: 100dvh; background: var(--color-background); }
  .chv--open .chv__pane > * { flex: 1; min-height: 0; }
}

/* планшет и desktop: две колонки фиксированной высоты, прокручиваются по отдельности */
@media (min-width: 768px) {
  .chv { flex-direction: row; height: calc(100dvh - var(--header-h) - 56px - 48px); min-height: 480px; border: var(--border-width) solid var(--color-stroke-gray); border-radius: var(--radius-md); overflow: hidden; }
  .chv__list { flex: 0 0 300px; padding: 16px 16px 0; overflow-y: auto; border-inline-end: var(--border-width) solid var(--color-separator-gray); }
  .chv__items { margin-inline: -12px; padding-bottom: 12px; }
  .chv__pane { display: flex; flex: 1; flex-direction: column; min-width: 0; }
  .chv__pane > * { flex: 1; min-height: 0; }
  .chv__placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: var(--color-label-gray); }
  .chv__placeholder p { margin: 0; color: var(--color-label-secondary); }
  .chv__list :deep(.cph__title) { font-size: var(--text-22-24); line-height: var(--leading-22-24); }
}
@media (min-width: 1380px) {
  .chv { height: calc(100dvh - var(--header-h) - 64px); }
  .chv__list { flex-basis: 320px; }
}
</style>
