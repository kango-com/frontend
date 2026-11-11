<script setup lang="ts">
import { contactLinks } from '~/utils/ad-view'

const props = defineProps<{
  phone?: string
  telegram?: string
  whatsapp?: string
  /** Объявление, по которому открывается чат: показывает кнопку «Написать в чат» */
  adId?: string
  /** Гость: сами контакты не получены, кнопки ведут на вход (ТЗ п. 6, 12 №5) */
  hidden?: boolean
  kinds?: ('phone' | 'telegram' | 'whatsapp')[]
}>()

const ui = useUiStore()
const route = useRoute()
const links = computed(() => (props.hidden
  ? (props.kinds ?? []).map(kind => ({ kind, label: kind === 'phone' ? tr('Позвонить') : kind === 'telegram' ? 'Telegram' : 'WhatsApp', href: '' }))
  : contactLinks(props)))
const toLogin = () => ui.openLogin(route.fullPath)
</script>

<template>
  <div v-if="links.length || adId" class="cbar" role="group" :aria-label="tr('Связаться с автором')">
    <KButton
      v-for="l in links"
      :key="l.kind"
      class="cbar__btn"
      :class="`cbar__btn--${l.kind}`"
      :variant="l.kind === 'phone' ? 'primary' : 'outline'"
      :href="hidden ? undefined : l.href"
      :target="hidden || l.kind === 'phone' ? undefined : '_blank'"
      :rel="hidden ? undefined : 'noopener'"
      @click="hidden ? toLogin() : undefined"
    >
      <template v-if="l.kind === 'phone'" #icon-left><Icon name="kango:phone-call-24" size="20" /></template>
      {{ tr(l.label) }}
    </KButton>
    <!-- внутренний чат: ведёт в раздел «Сообщения» (для гостя откроется окно входа) -->
    <KButton v-if="adId" class="cbar__btn cbar__chat" variant="neutral" :to="`/messages?ad=${adId}`">
      <template #icon-left><Icon name="kango:message-24" size="20" /></template>
      {{ tr('Написать в чат') }}
    </KButton>
  </div>
  <p v-else class="cbar__none">{{ tr('Автор не оставил контактов.') }}</p>
</template>

<style scoped>
.cbar { display: flex; flex-direction: column; gap: 10px; }
.cbar .cbar__btn { width: 100%; min-height: 48px; border-radius: 14px; }
.cbar .cbar__btn--whatsapp { border-color: #1b9a5b; color: #137a47; }
.cbar .cbar__btn--telegram { border-color: var(--color-fill-color-3); color: var(--color-fill-color-3); }
.cbar .cbar__chat { background: #dff2ee; color: var(--color-fill-color-3); }
.cbar__none { margin: 0; color: var(--color-label-secondary); font-size: var(--text-14-16); }
</style>
