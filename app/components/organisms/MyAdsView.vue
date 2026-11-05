<script setup lang="ts">
import { formatPrice, formatPublished, formatDay } from '~/utils/format'
import { MY_ADS_TABS, type MyAdsTab } from '~/stores/myAds'

/** «Мои объявления»: вкладки по статусам (ТЗ п. 7.1), действия по статусу, подтверждение удаления */
const mine = useMyAdsStore()
const route = useRoute()
const router = useRouter()

onMounted(() => mine.load())

const TAB_LABEL: Record<MyAdsTab, string> = { active: 'Активные', moderation: 'На модерации', rejected: 'Отклонённые', hidden: 'Снятые' }
const EMPTY: Record<MyAdsTab, string> = {
  active: 'Активных объявлений нет.',
  moderation: 'Сейчас на проверке ничего нет.',
  rejected: 'Отклонённых объявлений нет.',
  hidden: 'Снятых с публикации объявлений нет.'
}

// вкладка живёт в адресе: ссылки из обзора кабинета открывают нужную
const tab = computed<MyAdsTab>(() => (MY_ADS_TABS as string[]).includes(String(route.query.tab)) ? route.query.tab as MyAdsTab : 'active')
const setTab = (t: MyAdsTab) => router.replace({ query: { ...route.query, tab: t, saved: undefined } })
const list = computed(() => mine.byStatus(tab.value))

// стрелки влево-вправо по вкладкам (шаблон WAI-ARIA tabs)
const tabRefs = ref<HTMLButtonElement[]>([])
function onKey(e: KeyboardEvent, i: number) {
  const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key]
  if (!dir) return
  const rtl = document.documentElement.dir === 'rtl'
  const next = (i + (rtl ? -dir : dir) + MY_ADS_TABS.length) % MY_ADS_TABS.length
  setTab(MY_ADS_TABS[next]!)
  tabRefs.value[next]?.focus()
}

const saved = computed(() => route.query.saved === '1')
const message = ref('')
const failed = ref('')
const busyId = ref<string | null>(null)

async function run(id: string, fn: (id: string) => Promise<boolean>, ok: string) {
  busyId.value = id
  failed.value = ''
  message.value = ''
  const done = await fn(id)
  busyId.value = null
  if (done) message.value = ok
  else failed.value = tr('Не удалось выполнить действие. Попробуйте ещё раз.')
}

const hide = (id: string) => run(id, mine.hide, tr('Объявление снято с публикации и перенесено в «Снятые».'))
const republish = (id: string) => run(id, mine.republish, tr('Объявление снова опубликовано.'))
const edit = (id: string) => router.push({ path: '/new', query: { edit: id } })
// продвижение существующего объявления не трогает черновик подачи: id уходит в адрес страницы
const promote = (id: string) => router.push({ path: '/new/promote', query: { ad: id } })

const toDelete = ref<string | null>(null)
async function confirmRemove() {
  const id = toDelete.value
  toDelete.value = null
  if (id) await run(id, mine.remove, tr('Объявление удалено.'))
}
</script>

<template>
  <section class="mav">
    <CabinetPageHead :title="tr('Мои объявления')">
      <KButton to="/new" size="sm" class="mav__new">{{ tr('Подать объявление') }}</KButton>
    </CabinetPageHead>

    <div class="mav__tabs" role="tablist" :aria-label="tr('Статус объявлений')">
      <button
        v-for="(t, i) in MY_ADS_TABS"
        :id="`mav-tab-${t}`"
        :key="t"
        ref="tabRefs"
        type="button"
        role="tab"
        class="mav__tab"
        :aria-selected="tab === t"
        :aria-controls="`mav-panel`"
        :tabindex="tab === t ? 0 : -1"
        @click="setTab(t)"
        @keydown="onKey($event, i)"
      >
        {{ tr(TAB_LABEL[t]) }}
        <span v-if="mine.status === 'success'" class="mav__count" :class="{ 'mav__count--error': t === 'rejected' && mine.counts.rejected }">{{ mine.counts[t] }}</span>
      </button>
    </div>

    <div id="mav-panel" class="mav__panel" role="tabpanel" :aria-labelledby="`mav-tab-${tab}`">
      <p v-if="saved" class="mav__ok" role="status">{{ tr('Изменения сохранены.') }}</p>
      <p v-if="message" class="mav__ok" role="status">{{ message }}</p>
      <p v-if="failed" class="mav__error" role="alert">{{ failed }}</p>

      <ul v-if="list.length" class="mav__list">
        <li v-for="ad in list" :key="ad.id">
          <MyAdCard
            :title="ad.title"
            :price="formatPrice(ad.price)"
            :location="ad.location"
            :image="ad.image"
            :to="`/ad/${ad.id}`"
            :status="ad.status"
            :published="formatPublished(ad.createdAt)"
            :views="ad.views"
            :active-until="ad.expiresAt ? formatDay(ad.expiresAt) : undefined"
            :promoted-until="ad.promotedUntil ? formatDay(ad.promotedUntil) : undefined"
            :highlighted-until="ad.highlightedUntil ? formatDay(ad.highlightedUntil) : undefined"
            :reject-reason="ad.rejectReason ? tr(ad.rejectReason) : undefined"
            :busy="busyId === ad.id"
            @edit="edit(ad.id)"
            @hide="hide(ad.id)"
            @republish="republish(ad.id)"
            @promote="promote(ad.id)"
            @remove="toDelete = ad.id"
          />
        </li>
      </ul>
      <p v-else-if="mine.status === 'loading' || mine.status === 'idle'" class="mav__note" aria-busy="true">{{ tr('Загрузка...') }}</p>
      <p v-else-if="mine.status === 'error'" class="mav__note" role="alert">
        {{ tr('Не удалось загрузить объявления.') }} <KTextButton size="sm" @click="mine.load()">{{ tr('Повторить') }}</KTextButton>
      </p>
      <div v-else class="mav__empty">
        <p>{{ tr(EMPTY[tab]) }}</p>
        <KButton v-if="tab === 'active'" to="/new" variant="outline">{{ tr('Подать объявление') }}</KButton>
      </div>
    </div>

    <KModalSheet :model-value="!!toDelete" :title="tr('Удалить объявление?')" dialog @update:model-value="v => { if (!v) toDelete = null }">
      <div class="mav__confirm">
        <p>{{ tr('Объявление исчезнет из кабинета, поиска и ленты. Восстановить его сможет только поддержка.') }}</p>
        <KButton block @click="confirmRemove">{{ tr('Удалить') }}</KButton>
        <KButton block variant="outline" @click="toDelete = null">{{ tr('Отмена') }}</KButton>
      </div>
    </KModalSheet>
  </section>
</template>

<style scoped>
.mav { display: flex; flex-direction: column; gap: 16px; }
.mav__tabs { display: flex; gap: 4px; margin-inline: -16px; padding-inline: 16px; overflow-x: auto; border-bottom: var(--border-width) solid var(--color-separator-gray); scrollbar-width: none; }
.mav__tabs::-webkit-scrollbar { display: none; }
.mav__tab { position: relative; display: inline-flex; flex: none; align-items: center; gap: 6px; height: 44px; padding: 0 12px; border: 0; background: none; color: var(--color-label-secondary); font-family: inherit; font-size: var(--text-15-16); white-space: nowrap; cursor: pointer; }
.mav__tab[aria-selected='true'] { color: var(--color-label-primary); font-weight: var(--font-weight-medium); }
.mav__tab[aria-selected='true']::after { content: ''; position: absolute; inset-inline: 8px; bottom: -1px; height: 2px; border-radius: 2px; background: var(--color-fill-primary); }
.mav__tab:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: -4px; border-radius: var(--radius-sm); }
.mav__count { min-width: 20px; padding: 2px 6px; border-radius: var(--radius-pill); background: var(--color-fill-gray-3); color: var(--color-label-secondary); font-size: var(--text-12-12); line-height: var(--leading-12-12); font-weight: var(--font-weight-medium); text-align: center; }
.mav__count--error { background: var(--color-fill-error); color: var(--color-label-white); }
@media (hover: hover) {
  .mav__tab:not([aria-selected='true']):hover { color: var(--color-label-primary); }
}
.mav__panel { display: flex; flex-direction: column; gap: 12px; }
.mav__list { display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px; margin: 0; padding: 0; list-style: none; }
.mav__ok { margin: 0; padding: 10px 14px; border-radius: var(--radius-md); background: var(--color-fill-tint); font-size: var(--text-14-16); line-height: 20px; }
.mav__error { margin: 0; color: var(--color-fill-error); font-size: var(--text-14-16); }
.mav__note, .mav__empty p { margin: 0; color: var(--color-label-secondary); }
.mav__empty { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; padding-block: 24px; }
.mav__confirm { display: flex; flex-direction: column; gap: 8px; }
.mav__confirm p { margin: 0 0 8px; color: var(--color-label-secondary); }
@media (max-width: 767px) {
  /* на телефоне кнопка подачи есть в таббаре и в обзоре кабинета */
  .mav .mav__new { display: none; }
}
@media (min-width: 768px) {
  .mav__tabs { margin-inline: 0; padding-inline: 0; }
  .mav__list { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
}
@media (min-width: 1920px) {
  .mav__list { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
</style>
