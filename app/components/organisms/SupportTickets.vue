<script setup lang="ts">
import { isOpenTicket } from '~/utils/ticket'

/** Поддержка в кабинете: список своих обращений со статусами и непрочитанными ответами (Договор, Прил. 1, п. 7.3) */
const support = useSupportStore()
const filter = ref<'open' | 'all'>('open')
const FILTERS = [{ value: 'open', label: 'Открытые' }, { value: 'all', label: 'Все' }]

onMounted(() => support.loadList())

const shown = computed(() => (filter.value === 'open' ? support.tickets.filter(t => isOpenTicket(t.status)) : support.tickets))
const loading = computed(() => support.listStatus === 'loading' && !support.tickets.length)
</script>

<template>
  <section class="stk" :aria-label="tr('Обращения в поддержку')">
    <CabinetPageHead :title="tr('Поддержка')" />

    <div class="stk__bar">
      <KSegmentControl v-model="filter" class="stk__filter" :options="FILTERS.map(f => ({ ...f, label: tr(f.label) }))" :label="tr('Показать')" />
      <KButton to="/profile/support/new" class="stk__new">{{ tr('Новое обращение') }}</KButton>
    </div>

    <p v-if="loading" class="stk__note" role="status">{{ tr('Загрузка...') }}</p>
    <p v-else-if="support.listStatus === 'error'" class="stk__note" role="alert">
      {{ tr('Не удалось загрузить обращения.') }} <KTextButton size="sm" @click="support.loadList()">{{ tr('Повторить') }}</KTextButton>
    </p>
    <div v-else-if="!shown.length" class="stk__empty">
      <p class="stk__note">{{ filter === 'open' && support.tickets.length ? tr('Открытых обращений нет.') : tr('Обращений пока нет. Если что-то пошло не так, напишите нам.') }}</p>
      <KButton v-if="!support.tickets.length" to="/profile/support/new" variant="outline">{{ tr('Новое обращение') }}</KButton>
    </div>
    <ul v-else class="stk__list">
      <li v-for="t in shown" :key="t.id"><TicketRow :ticket="t" /></li>
    </ul>

    <p class="stk__more">
      {{ tr('Ответы на частые вопросы, контакты и реквизиты') }} - <NuxtLink to="/support">{{ tr('на странице поддержки') }}</NuxtLink>
    </p>
  </section>
</template>

<style scoped>
.stk { display: flex; flex-direction: column; gap: 16px; max-width: 760px; }
.stk__bar { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
.stk__filter { flex: 1 1 200px; max-width: 280px; }
.stk__new { flex: 0 0 auto; margin-inline-start: auto; }
.stk__list { display: flex; flex-direction: column; gap: 10px; margin: 0; padding: 0; list-style: none; }
.stk__empty { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
.stk__note { margin: 0; color: var(--color-label-secondary); font-size: var(--text-14-16); line-height: 20px; }
.stk__more { margin: 0; color: var(--color-label-secondary); font-size: var(--text-14-16); line-height: 20px; }
.stk__more a { color: var(--color-fill-color-3); }
@media (min-width: 768px) {
  .stk { gap: 20px; }
}
</style>
