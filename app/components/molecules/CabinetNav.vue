<script setup lang="ts">
import type { CabinetLink } from '~/utils/cabinet'

/** Меню кабинета: `sidebar` - боковая колонка на 1380+, `list` - строки со стрелкой на телефоне и планшете */
withDefaults(defineProps<{
  links: CabinetLink[]
  /** Значения счётчиков по ключу `count` ссылки; 0 и пусто не показываются */
  counts?: Partial<Record<NonNullable<CabinetLink['count']>, number>>
  variant?: 'sidebar' | 'list'
}>(), { counts: () => ({}), variant: 'list' })

const route = useRoute()
const isCurrent = (to: string) => route.path === to || route.path.startsWith(`${to}/`)
</script>

<template>
  <nav class="cnav" :class="`cnav--${variant}`" :aria-label="tr('Разделы кабинета')">
    <ul class="cnav__list">
      <li v-for="l in links" :key="l.to">
        <NuxtLink :to="l.to" class="cnav__link" :aria-current="isCurrent(l.to) ? 'page' : undefined">
          <span class="cnav__label">{{ tr(l.label) }}</span>
          <span v-if="l.count && counts[l.count]" class="cnav__count">{{ counts[l.count] }}</span>
          <Icon v-if="variant === 'list'" name="kango:chevron-right-20" size="20" class="cnav__chevron" />
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.cnav__list { margin: 0; padding: 0; list-style: none; }
.cnav .cnav__link { display: flex; align-items: center; gap: 8px; min-height: 48px; color: var(--color-label-primary); font-size: var(--text-17-20); line-height: var(--leading-17-20); text-decoration: none; }
.cnav__label { flex: 1; min-width: 0; }
.cnav__count { color: var(--color-label-secondary); font-size: var(--text-15-16); }
.cnav__chevron { flex: none; color: var(--color-label-gray); }
[dir='rtl'] .cnav__chevron { transform: scaleX(-1); }
.cnav__link:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; border-radius: var(--radius-sm); }

/* list: строки с разделителями, как меню настроек на телефоне */
.cnav--list .cnav__list > li + li { border-top: var(--border-width) solid var(--color-separator-gray); }

/* sidebar: текущий раздел подсвечен фоном и полосой у начала строки */
.cnav--sidebar .cnav__list { display: flex; flex-direction: column; gap: 2px; }
.cnav--sidebar .cnav__link { position: relative; min-height: 44px; padding-inline: 16px 12px; border-radius: var(--radius-md); font-size: var(--text-16-20); line-height: var(--leading-16-20); transition: background-color 0.15s ease-out; }
.cnav--sidebar .cnav__link[aria-current='page'] { background: color-mix(in srgb, var(--color-fill-primary) 6%, transparent); font-weight: var(--font-weight-medium); }
.cnav--sidebar .cnav__link[aria-current='page']::before { content: ''; position: absolute; inset-block: 10px; inset-inline-start: 0; width: 3px; border-radius: 2px; background: var(--color-fill-primary); }
@media (hover: hover) {
  .cnav--sidebar .cnav__link:not([aria-current='page']):hover { background: var(--color-fill-gray-3); }
}
</style>
