<script setup lang="ts">
import type { Purchase } from '~/types'
import { formatDay, formatNumber, formatPublished } from '~/utils/format'

/** «Платные услуги»: действующие опции со сроком и история операций (ТЗ п. 7.1, критерий приёмки 13) */
const purchases = usePurchasesStore()
onMounted(() => purchases.load())

const STATUS: Record<Purchase['status'], string> = { paid: 'Оплачено', pending: 'Ожидает оплаты', failed: 'Ошибка оплаты', cancelled: 'Отменено' }

/** Сколько дней осталось (для подписи «ещё 3 дн.») */
const daysLeft = (iso: string) => Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000))
</script>

<template>
  <section class="psv">
    <CabinetPageHead :title="tr('Платные услуги')" />

    <CabinetCard :title="tr('Действуют сейчас')" :description="tr('Поднятие возвращает объявление в начало ленты, выделение подсвечивает его цветом.')">
      <ul v-if="purchases.active.length" class="psv__cards">
        <li v-for="p in purchases.active" :key="p.id" class="psv__card">
          <span class="psv__badge">{{ tr(p.title) }}</span>
          <NuxtLink :to="`/ad/${p.adId}`" class="psv__ad">{{ p.adTitle }}</NuxtLink>
          <span class="psv__until">
            {{ tr('до {date}', { date: formatDay(p.activeUntil!) }) }}
            <span class="psv__left">· {{ tr('ещё {n} дн.', { n: daysLeft(p.activeUntil!) }) }}</span>
          </span>
          <KButton :to="`/new/promote?ad=${p.adId}`" size="sm" variant="plain" class="psv__extend">{{ tr('Продлить') }}</KButton>
        </li>
      </ul>
      <p v-else-if="purchases.status === 'loading' || purchases.status === 'idle'" class="psv__note" aria-busy="true">{{ tr('Загрузка...') }}</p>
      <div v-else class="psv__empty">
        <p>{{ tr('Подключённых опций нет.') }}</p>
        <KButton to="/profile/ads" variant="outline">{{ tr('Выбрать объявление') }}</KButton>
      </div>
    </CabinetCard>

    <CabinetCard :title="tr('История операций')">
      <p v-if="purchases.status === 'error'" class="psv__note" role="alert">
        {{ tr('Не удалось загрузить историю.') }} <KTextButton size="sm" @click="purchases.load()">{{ tr('Повторить') }}</KTextButton>
      </p>
      <table v-else-if="purchases.items.length" class="psv__table">
        <thead>
          <tr>
            <th scope="col">{{ tr('Дата') }}</th>
            <th scope="col">{{ tr('Услуга') }}</th>
            <th scope="col">{{ tr('Сумма') }}</th>
            <th scope="col">{{ tr('Статус') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in purchases.items" :key="p.id">
            <td class="psv__date">{{ formatPublished(p.createdAt) }}</td>
            <td class="psv__what">
              <span class="psv__name">{{ tr(p.title) }}</span>
              <NuxtLink :to="`/ad/${p.adId}`" class="psv__ad-link">{{ p.adTitle }}</NuxtLink>
            </td>
            <td class="psv__sum">{{ formatNumber(p.amount) }} ₪</td>
            <td><span class="psv__status" :class="`psv__status--${p.status}`">{{ tr(STATUS[p.status]) }}</span></td>
          </tr>
        </tbody>
      </table>
      <p v-else-if="purchases.status === 'success'" class="psv__note">{{ tr('Операций пока не было.') }}</p>
    </CabinetCard>
  </section>
</template>

<style scoped>
.psv { display: flex; flex-direction: column; gap: 16px; }
@media (min-width: 768px) { .psv { gap: 20px; } }
.psv__cards { display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px; margin: 0; padding: 0; list-style: none; }
.psv__card { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 6px 12px; padding: 14px 16px; border-radius: var(--radius-md); background: var(--color-fill-gray-4); }
.psv__badge { justify-self: start; padding: 2px 8px; border-radius: var(--radius-pill); background: color-mix(in srgb, var(--color-fill-primary) 10%, transparent); color: var(--color-fill-color-4); font-size: var(--text-12-16); line-height: var(--leading-12-16); font-weight: var(--font-weight-medium); }
.psv .psv__extend { grid-row: 1 / span 3; grid-column: 2; }
.psv .psv__ad { color: var(--color-label-primary); font-size: var(--text-16-20); line-height: var(--leading-16-20); font-weight: var(--font-weight-medium); text-decoration: none; overflow-wrap: anywhere; }
.psv__ad:hover, .psv__ad-link:hover { text-decoration: underline; }
.psv__until { font-size: var(--text-14-16); line-height: var(--leading-14-16); }
.psv__left { color: var(--color-label-secondary); }
.psv__note, .psv__empty p { margin: 0; color: var(--color-label-secondary); line-height: 20px; }
.psv__empty { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }

/* История: на телефоне строки складываются в карточки, с планшета - обычная таблица */
.psv__table { width: 100%; border-collapse: collapse; font-size: var(--text-14-16); line-height: var(--leading-14-16); }
.psv__table th { padding: 8px 12px 8px 0; border-bottom: var(--border-width) solid var(--color-separator-gray); color: var(--color-label-secondary); font-weight: var(--font-weight-regular); text-align: start; }
.psv__table td { padding: 12px 12px 12px 0; border-bottom: var(--border-width) solid var(--color-separator-gray); vertical-align: top; }
[dir='rtl'] .psv__table th, [dir='rtl'] .psv__table td { padding-inline: 0 12px; }
.psv__what { display: flex; flex-direction: column; gap: 2px; }
.psv__name { font-weight: var(--font-weight-medium); }
.psv .psv__ad-link { color: var(--color-label-secondary); text-decoration: none; overflow-wrap: anywhere; }
.psv__sum { white-space: nowrap; font-variant-numeric: tabular-nums; }
.psv__date { white-space: nowrap; color: var(--color-label-secondary); }
.psv__status { white-space: nowrap; }
.psv__status--paid { color: var(--color-fill-color-3); }
.psv__status--failed { color: var(--color-fill-error); }
.psv__status--cancelled, .psv__status--pending { color: var(--color-label-secondary); }
@media (max-width: 767px) {
  .psv__table thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  .psv__table, .psv__table tbody { display: block; }
  .psv__table tr { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 4px 12px; padding: 12px 0; border-bottom: var(--border-width) solid var(--color-separator-gray); }
  .psv__table td { padding: 0 !important; border: 0; }
  .psv__table .psv__date { grid-column: 1 / -1; order: -1; font-size: var(--text-12-16); }
  .psv__table td:last-child { grid-column: 1 / -1; }
}
@media (min-width: 768px) {
  .psv__cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>
