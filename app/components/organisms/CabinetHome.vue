<script setup lang="ts">
import { formatSince } from '~/utils/ad-view'
import { formatDay } from '~/utils/format'
import { CABINET_LINKS } from '~/utils/cabinet'
import type { MyAdsTab } from '~/stores/myAds'

/** Обзор кабинета: пользователь, сводка по объявлениям и опциям; на телефоне и планшете - меню кабинета и выход */
const auth = useAuthStore()
const mine = useMyAdsStore()
const favorites = useFavoritesStore()
const purchases = usePurchasesStore()
const chat = useChatStore()
const support = useSupportStore()
const router = useRouter()

const tiles = computed<{ tab: MyAdsTab, label: string, tone?: 'error' }[]>(() => [
  { tab: 'active', label: 'Активные' },
  { tab: 'moderation', label: 'На модерации' },
  { tab: 'rejected', label: 'Отклонённые', tone: mine.counts.rejected ? 'error' : undefined },
  { tab: 'hidden', label: 'Снятые' }
])

const counts = computed(() => ({ ads: mine.items.length, favorites: favorites.items.length, services: purchases.active.length, messages: chat.unreadTotal, support: support.unreadTotal }))
const nextExpiry = computed(() => purchases.active.map(p => p.activeUntil!).sort()[0])

async function logout() {
  await auth.logout()
  mine.reset()
  purchases.reset()
  favorites.clear()
  await router.push('/')
}
</script>

<template>
  <section class="ch" aria-labelledby="ch-title">
    <div v-if="auth.user" class="ch__head">
      <UserAvatar :name="auth.user.name" :src="auth.user.avatarUrl" :size="64" />
      <div class="ch__who">
        <h1 id="ch-title" class="ch__name">{{ auth.user.name }}</h1>
        <span class="ch__meta">{{ auth.user.email }}</span>
        <span class="ch__meta">{{ tr('На сервисе с') }} {{ formatSince(auth.user.createdAt) }}</span>
      </div>
      <KButton to="/profile/edit" variant="outline" class="ch__edit">{{ tr('Редактировать') }}</KButton>
    </div>

    <section class="ch__block" aria-labelledby="ch-ads">
      <div class="ch__row">
        <h2 id="ch-ads" class="ch__h2">{{ tr('Мои объявления') }}</h2>
        <KButton to="/new" size="sm" variant="plain">{{ tr('Подать объявление') }}</KButton>
      </div>
      <ul class="ch__tiles" :aria-busy="mine.status === 'loading'">
        <li v-for="t in tiles" :key="t.tab">
          <NuxtLink :to="{ path: '/profile/ads', query: { tab: t.tab } }" class="ch__tile" :class="{ 'ch__tile--error': t.tone === 'error' }">
            <span class="ch__num">{{ mine.status === 'success' ? mine.counts[t.tab] : '–' }}</span>
            <span class="ch__label">{{ tr(t.label) }}</span>
          </NuxtLink>
        </li>
      </ul>
      <p v-if="mine.counts.rejected" class="ch__alert" role="status">
        {{ tr('Есть отклонённые объявления. Исправьте их, и они снова уйдут на проверку.') }}
        <NuxtLink :to="{ path: '/profile/ads', query: { tab: 'rejected' } }">{{ tr('Посмотреть') }}</NuxtLink>
      </p>
    </section>

    <NuxtLink to="/profile/services" class="ch__promo">
      <span class="ch__promo-text">
        <span class="ch__promo-title">{{ tr('Платные услуги') }}</span>
        <span class="ch__meta">
          <template v-if="purchases.active.length">{{ tr('Действует опций: {n}', { n: purchases.active.length }) }} · {{ tr('ближайшая до {date}', { date: formatDay(nextExpiry!) }) }}</template>
          <template v-else>{{ tr('Поднимите или выделите объявление, чтобы его увидели больше людей') }}</template>
        </span>
      </span>
      <Icon name="kango:chevron-right-20" size="20" class="ch__chevron" />
    </NuxtLink>

    <CabinetNav :links="CABINET_LINKS" :counts="counts" variant="list" class="ch__menu" />
    <KButton variant="neutral" class="ch__logout" @click="logout">{{ tr('Выйти') }}</KButton>
  </section>
</template>

<style scoped>
.ch { display: flex; flex-direction: column; gap: 24px; padding-top: 8px; }
.ch__head { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 12px 16px; }
.ch__who { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.ch__name { margin: 0 0 2px; font-size: var(--text-22-24); line-height: var(--leading-22-24); font-weight: var(--font-weight-medium); overflow-wrap: anywhere; }
.ch__meta { color: var(--color-label-secondary); font-size: var(--text-14-16); line-height: var(--leading-14-16); overflow-wrap: anywhere; }
.ch .ch__edit { grid-column: 1 / -1; }
.ch__block { display: flex; flex-direction: column; gap: 12px; }
.ch__row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.ch__h2 { margin: 0; font-size: var(--text-20-20); line-height: var(--leading-20-20); font-weight: var(--font-weight-medium); }
.ch__tiles { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin: 0; padding: 0; list-style: none; }
.ch .ch__tile { display: flex; flex-direction: column; gap: 6px; height: 100%; padding: 14px 16px; border-radius: var(--radius-md); background: var(--color-fill-gray-4); color: var(--color-label-primary); text-decoration: none; transition: background-color 0.15s ease-out; }
.ch__tile:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
.ch__num { font-size: var(--text-28-28); line-height: var(--leading-28-28); font-weight: var(--font-weight-medium); font-variant-numeric: tabular-nums; }
.ch__label { color: var(--color-label-secondary); font-size: var(--text-14-16); line-height: var(--leading-14-16); }
.ch__tile--error .ch__num { color: var(--color-fill-error); }
.ch__alert { margin: 0; padding: 12px 16px; border-radius: var(--radius-md); background: color-mix(in srgb, var(--color-fill-error) 8%, transparent); font-size: var(--text-14-16); line-height: 20px; }
.ch__alert a { color: var(--color-fill-color-3); font-weight: var(--font-weight-medium); }
.ch .ch__promo { display: flex; align-items: center; gap: 12px; padding: 16px; border: var(--border-width) solid var(--color-stroke-gray); border-radius: var(--radius-md); color: inherit; text-decoration: none; }
.ch__promo:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
.ch__promo-text { display: flex; flex: 1; flex-direction: column; gap: 4px; min-width: 0; }
.ch__promo-title { font-size: var(--text-17-20); line-height: var(--leading-17-20); font-weight: var(--font-weight-medium); }
.ch__chevron { flex: none; color: var(--color-label-gray); }
[dir='rtl'] .ch__chevron { transform: scaleX(-1); }
.ch__menu { border-block: var(--border-width) solid var(--color-separator-gray); }
.ch .ch__logout { align-self: flex-start; min-width: 160px; }
@media (hover: hover) {
  .ch .ch__tile:hover { background: color-mix(in srgb, var(--color-fill-tint) 70%, transparent); }
  .ch .ch__promo:hover { border-color: var(--color-stroke-primary); }
}
@media (min-width: 768px) {
  .ch__head { grid-template-columns: auto minmax(0, 1fr) auto; }
  .ch .ch__edit { grid-column: auto; }
  .ch__tiles { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
@media (min-width: 1380px) {
  .ch { gap: 32px; padding-top: 0; }
  .ch__name { font-size: 28px; line-height: 32px; }
  /* на desktop меню и выход - в боковой колонке оболочки */
  .ch__menu, .ch .ch__logout { display: none; }
}
</style>
