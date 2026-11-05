<script setup lang="ts">
export interface TabBarItem {
  key: string
  label: string
  to: string
  icon: string
}

const props = withDefaults(defineProps<{
  /** Ключ активного пункта (home, favorites, add, messages, account) */
  current?: string
  authorized?: boolean
  items?: TabBarItem[]
  /** Счётчики на иконках по ключу пункта (например непрочитанные сообщения) */
  badges?: Record<string, number>
}>(), { current: '' })

const { t } = useI18n()

const defaults = computed<TabBarItem[]>(() => [
  { key: 'home', label: t('tabs.home'), to: '/', icon: 'home-24' },
  { key: 'favorites', label: t('tabs.favorites'), to: '/favorites', icon: 'heart-24' },
  { key: 'add', label: t('tabs.add'), to: '/new', icon: 'plus-square-24' },
  { key: 'messages', label: t('tabs.messages'), to: '/messages', icon: 'message-24' },
  props.authorized
    ? { key: 'account', label: t('tabs.profile'), to: '/profile', icon: 'user-24' }
    : { key: 'account', label: t('tabs.login'), to: '/login', icon: 'user-24' }
])
const list = computed(() => props.items ?? defaults.value)
</script>

<template>
  <nav class="ktbar" :aria-label="t('nav.main')">
    <KTab v-for="i in list" :key="i.key" class="ktbar__item" :to="i.to" :selected="i.key === current">
      <template #icon>
        <span class="ktbar__icon">
          <Icon :name="`kango:${i.icon}`" size="24" />
          <KBadge v-if="badges?.[i.key]" :count="badges[i.key]!" :label="tr('непрочитанных')" class="ktbar__badge" />
        </span>
      </template>
      {{ i.label }}
    </KTab>
  </nav>
</template>

<style scoped>
.ktbar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 4px;
  /* Индикатор жеста iOS из макета (24px) не рисуем, отступ только под системную safe-area */
  padding: 4px 8px calc(4px + env(safe-area-inset-bottom));
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  background: var(--color-background);
  box-shadow: 0 -2px 12px color-mix(in srgb, var(--color-label-primary) 8%, transparent);
}
.ktbar .ktbar__item { flex: 1; min-width: 0; padding: 0 4px; }
.ktbar__icon { position: relative; display: inline-flex; }
.ktbar .ktbar__badge { position: absolute; top: -6px; inset-inline-start: 14px; min-width: 18px; height: 18px; border: 2px solid var(--color-background); font-size: 10px; }
</style>
