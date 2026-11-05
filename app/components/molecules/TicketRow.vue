<script setup lang="ts">
import type { Ticket } from '~/types'
import { formatChatTime } from '~/utils/format'
import { categoryLabel } from '~/utils/ticket'

/** Строка списка обращений: номер, тема, категория, статус, время последнего сообщения, точка при непрочитанном ответе */
const props = defineProps<{ ticket: Ticket }>()
const preview = computed(() => props.ticket.lastMessage?.text ?? '')
</script>

<template>
  <NuxtLink :to="`/profile/support/${ticket.id}`" class="trow" :class="{ 'trow--unread': ticket.unread > 0 }">
    <span class="trow__main">
      <span class="trow__top">
        <span class="trow__num">№ {{ ticket.number }}</span>
        <span class="trow__cat">{{ tr(categoryLabel(ticket.category)) }}</span>
        <time class="trow__time" :datetime="ticket.updatedAt">{{ formatChatTime(ticket.updatedAt) }}</time>
      </span>
      <span class="trow__subject">{{ ticket.subject }}</span>
      <span v-if="preview" class="trow__preview">{{ preview }}</span>
    </span>
    <span class="trow__side">
      <TicketStatusBadge :status="ticket.status" />
      <span v-if="ticket.unread" class="trow__dot" role="img" :aria-label="tr('Есть новый ответ')" />
    </span>
  </NuxtLink>
</template>

<style scoped>
.trow { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 14px 16px; border: var(--border-width) solid var(--color-stroke-gray); border-radius: var(--radius-md); background: var(--color-background); color: var(--color-label-primary); text-decoration: none; transition: background-color 0.15s ease-out; }
.trow--unread { border-color: var(--color-stroke-primary); }
.trow:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
@media (hover: hover) {
  .trow:hover { background: var(--color-fill-gray-4); }
}
.trow__main { display: flex; flex: 1; flex-direction: column; gap: 4px; min-width: 0; }
.trow__top { display: flex; align-items: center; gap: 8px; color: var(--color-label-secondary); font-size: var(--text-13-16); line-height: 16px; }
.trow__time { margin-inline-start: auto; }
.trow__subject { overflow: hidden; font-size: var(--text-16-20); line-height: var(--leading-16-20); font-weight: var(--font-weight-medium); text-overflow: ellipsis; white-space: nowrap; }
.trow__preview { display: -webkit-box; overflow: hidden; color: var(--color-label-secondary); font-size: var(--text-14-16); line-height: 20px; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.trow__side { display: flex; flex: none; flex-direction: column; align-items: flex-end; gap: 8px; }
.trow__dot { width: 10px; height: 10px; border-radius: 50%; background: var(--color-fill-primary); }
@media (max-width: 479px) {
  .trow { flex-direction: column; align-items: stretch; }
  .trow__side { flex-direction: row-reverse; align-items: center; }
}
</style>
