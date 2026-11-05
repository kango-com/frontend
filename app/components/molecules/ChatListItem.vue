<script setup lang="ts">
/** Строка списка диалогов: собеседник, объявление, последнее сообщение, время, непрочитанные */
defineProps<{
  to: string
  name: string
  avatarUrl?: string
  online?: boolean
  adTitle: string
  adImage?: string
  /** Последнее сообщение */
  preview?: string
  /** Последнее сообщение моё («Вы: ...») */
  mine?: boolean
  time?: string
  unread?: number
  /** Диалог открыт сейчас */
  active?: boolean
  blocked?: boolean
}>()
</script>

<template>
  <NuxtLink :to="to" class="cli" :class="{ 'cli--active': active, 'cli--unread': unread }" :aria-current="active ? 'page' : undefined">
    <span class="cli__ava">
      <UserAvatar :name="name" :src="avatarUrl" :size="48" />
      <span v-if="online" class="cli__online" :title="tr('В сети')" />
    </span>
    <span class="cli__body">
      <span class="cli__top">
        <span class="cli__name">{{ name }}</span>
        <span v-if="time" class="cli__time">{{ time }}</span>
      </span>
      <span class="cli__ad">
        <img v-if="adImage" :src="adImage" alt="" class="cli__ad-img">
        <span class="cli__ad-title">{{ adTitle }}</span>
      </span>
      <span class="cli__bottom">
        <span class="cli__preview">
          <template v-if="blocked">{{ tr('Пользователь заблокирован') }}</template>
          <template v-else><span v-if="mine" class="cli__you">{{ tr('Вы:') }} </span>{{ preview }}</template>
        </span>
        <span v-if="unread" class="cli__badge">
          <span aria-hidden="true">{{ unread > 99 ? '99+' : unread }}</span>
          <span class="cli__sr">{{ tr('непрочитанных: {n}', { n: unread }) }}</span>
        </span>
      </span>
    </span>
  </NuxtLink>
</template>

<style scoped>
.cli { display: flex; gap: 12px; padding: 12px; border-radius: var(--radius-md); color: var(--color-label-primary); text-decoration: none; transition: background-color 0.15s ease-out; }
.cli:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: -2px; }
.cli--active { background: color-mix(in srgb, var(--color-fill-primary) 6%, transparent); }
@media (hover: hover) {
  .cli:not(.cli--active):hover { background: var(--color-fill-gray-4); }
}
.cli__ava { position: relative; flex: none; height: 48px; }
.cli__online { position: absolute; inset-inline-end: 0; bottom: 1px; width: 12px; height: 12px; border: 2px solid var(--color-background); border-radius: 50%; background: #22a861; }
.cli__body { display: flex; flex: 1; flex-direction: column; gap: 3px; min-width: 0; }
.cli__top, .cli__bottom { display: flex; align-items: center; gap: 8px; }
.cli__name { flex: 1; min-width: 0; overflow: hidden; font-size: var(--text-16-20); line-height: var(--leading-16-20); font-weight: var(--font-weight-medium); text-overflow: ellipsis; white-space: nowrap; }
.cli__time { flex: none; color: var(--color-label-gray); font-size: var(--text-12-16); }
.cli--unread .cli__time { color: var(--color-fill-primary); }
.cli__ad { display: flex; align-items: center; gap: 6px; min-width: 0; color: var(--color-label-secondary); font-size: var(--text-13-16); line-height: var(--leading-13-16); }
.cli__ad-img { flex: none; width: 18px; height: 18px; border-radius: 4px; object-fit: cover; }
.cli__ad-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cli__preview { flex: 1; min-width: 0; overflow: hidden; color: var(--color-label-secondary); font-size: var(--text-14-16); line-height: 20px; text-overflow: ellipsis; white-space: nowrap; }
.cli--unread .cli__preview { color: var(--color-label-primary); }
.cli__you { color: var(--color-label-gray); }
.cli__badge { display: inline-flex; flex: none; align-items: center; justify-content: center; min-width: 20px; height: 20px; padding: 0 6px; border-radius: var(--radius-pill); background: var(--color-fill-primary); color: var(--color-label-white); font-size: var(--text-12-12); font-weight: var(--font-weight-medium); }
.cli__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
</style>
