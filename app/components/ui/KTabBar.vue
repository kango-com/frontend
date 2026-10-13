<script setup lang="ts">
export interface TabBarItem {
  key: string
  label: string
  to: string
  icon: string
}

const props = withDefaults(defineProps<{
  /** Ключ активного пункта (home, map, add, favorites, account) */
  current?: string
  authorized?: boolean
  items?: TabBarItem[]
}>(), { current: '' })

const defaults = computed<TabBarItem[]>(() => [
  { key: 'home', label: 'Главная', to: '/', icon: 'home-24' },
  { key: 'map', label: 'Карта', to: '/map', icon: 'map-24' },
  { key: 'add', label: 'Добавить', to: '/new', icon: 'plus-square-24' },
  { key: 'favorites', label: 'Избранное', to: '/favorites', icon: 'heart-24' },
  props.authorized
    ? { key: 'account', label: 'Профиль', to: '/profile', icon: 'user-24' }
    : { key: 'account', label: 'Войти', to: '/login', icon: 'user-24' }
])
const list = computed(() => props.items ?? defaults.value)
</script>

<template>
  <nav class="ktbar" aria-label="Основная навигация">
    <KTab v-for="i in list" :key="i.key" class="ktbar__item" :to="i.to" :selected="i.key === current">
      <template #icon><Icon :name="`kango:${i.icon}`" size="24" /></template>
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
</style>
