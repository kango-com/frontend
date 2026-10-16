<script setup lang="ts">
withDefaults(defineProps<{
  /** Показать строку поиска и фильтр под шапкой на мобильном и планшете */
  withSearch?: boolean
}>(), {})

const city = useCityStore()
const auth = useAuthStore()
const ui = useUiStore()
const router = useRouter()

/** Шапка прозрачная над обложкой главной и заливается после её прокрутки (страница управляет флагом) */
const solid = useState('header-solid', () => true)
const route = useRoute()
/** Запрос текущих результатов остаётся в поле шапки */
const search = ref(route.path === '/search' && typeof route.query.q === 'string' ? route.query.q : '')

async function submit(q: string, categoryTitle?: string) {
  const value = q.trim()
  suggestOpen.value = false
  if (!value) { router.push('/search'); return }
  await searchStore.submit(value, categoryTitle)
  search.value = value
  router.push({ path: '/search', query: { q: value } })
}

/** Выпадающие подсказки под полем поиска (desktop). На 375 и 768 тап на поле ведёт на экран поиска */
const searchStore = useSearchStore()
const root = ref<HTMLElement>()
const suggestOpen = ref(false)
const dropStyle = ref<Record<string, string>>({})

// переходы включаем после первого кадра: при загрузке главной шапка не должна «отыгрывать» смену залитой на прозрачную
const animated = ref(false)
onMounted(() => requestAnimationFrame(() => requestAnimationFrame(() => { animated.value = true })))

// пока поиск раскрыт, страница под ним не прокручивается
watch(suggestOpen, (v) => { if (v) lockScroll(); else unlockScroll() })
onBeforeUnmount(() => { if (suggestOpen.value) unlockScroll() })

// история и популярные запросы загружаем заранее: при раскрытии список уже готов, пустоты нет
onMounted(() => { searchStore.loadHistory(); searchStore.loadPopular() })

async function onFocusIn(e: FocusEvent) {
  const field = (e.target as HTMLElement).closest('form[role=search]')
  if (!field || !root.value) return
  if (window.innerWidth < 1380) return
  suggestOpen.value = true
  // поле расширяется, панель ставим по его новым размерам
  await nextTick()
  const box = (root.value.querySelector('.khd__search > :first-child') ?? field).getBoundingClientRect()
  const host = root.value.getBoundingClientRect()
  dropStyle.value = { left: `${box.left - host.left}px`, top: `${box.bottom - host.top + 8}px`, width: `${box.width}px` }
}
/** Стрелка вниз из поля шапки переводит фокус на первую строку списка */
function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'ArrowDown' || !suggestOpen.value) return
  if (!(e.target as HTMLElement).closest('.khd__search')) return
  const first = root.value?.querySelector<HTMLElement>('.app-header__drop .srow, .app-header__drop .hrow')
  if (first) { e.preventDefault(); first.focus() }
}
function onFocusOut(e: FocusEvent) {
  const next = e.relatedTarget as Node | null
  if (!next || !root.value?.contains(next)) suggestOpen.value = false
}
</script>

<template>
  <div ref="root" class="app-header" :class="{ 'app-header--solid': solid, 'app-header--animated': animated }" @focusin="onFocusIn" @focusout="onFocusOut" @keydown.esc="suggestOpen = false" @keydown="onKeydown">
    <KHeader
      v-model:search="search"
      :city="city.current.name"
      :logged-in="auth.isAuthed"
      :with-search="withSearch"
      :searching="suggestOpen"
      @city="ui.open('city')"
      @filter="ui.open('filters')"
      @categories="ui.open('menu')"
      @search-open="router.push('/search')"
      @submit="submit"
    />
    <Transition name="scrim"><div v-if="suggestOpen" class="app-header__scrim" aria-hidden="true" /></Transition>
    <Transition name="drop">
      <div v-if="suggestOpen" class="app-header__drop" :style="dropStyle" @mousedown.prevent>
        <SearchSuggest :query="search" @pick="submit" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: transparent;
}
.app-header :deep(.khd) { background: transparent; }

/* Фон и тень шапки лежат на отдельном слое, который проявляется через opacity: прокрутка не вызывает перерисовку,
   тень появляется вместе с фоном. Слой под содержимым шапки (z-index -1 внутри её контекста наложения). */
.app-header::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--color-background);
  opacity: 0;
  pointer-events: none;
}
.app-header--animated::before { transition: opacity 0.28s var(--ease-out-strong); }
.app-header--solid::before { opacity: 1; }
/* на desktop у залитой шапки мягкая тень снизу, чтобы контент не «врезался» в неё при прокрутке */
@media (min-width: 1380px) {
  .app-header::before { box-shadow: 0 2px 12px color-mix(in srgb, var(--color-label-primary) 8%, transparent); }
}
@media (prefers-reduced-motion: reduce) {
  .app-header--animated::before { transition-duration: 0.12s; transition-timing-function: linear; }
}
/* затемнение страницы под шапкой: лежит под содержимым шапки, но над страницей */
.app-header__scrim {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: color-mix(in srgb, var(--color-label-primary) 40%, transparent);
}
/* большая белая панель под полем, строки как в списке: значок, текст, без разделителей */
.app-header__drop {
  position: absolute;
  z-index: 50;
  max-height: 70dvh;
  overflow-y: auto;
  padding: 12px 16px 16px;
  border-radius: 20px;
  background: var(--color-background);
  box-shadow: 0 16px 40px color-mix(in srgb, var(--color-label-primary) 18%, transparent);
  transform-origin: top center;
}
.app-header__drop :deep(.srow),
.app-header__drop :deep(.hrow) { min-height: 48px; padding: 8px 12px; border-bottom: 0; border-radius: var(--radius-md); }
.app-header__drop :deep(.srow__chevron),
.app-header__drop :deep(.hrow__chevron) { display: none; }
.app-header__drop :deep(.srow__title),
.app-header__drop :deep(.hrow__title) { font-size: var(--text-16-20); line-height: var(--leading-16-20); }
.app-header__drop :deep(.srow__cat),
.app-header__drop :deep(.hrow__cat) { font-size: var(--text-12-16); line-height: var(--leading-12-16); }
@media (hover: hover) {
  .app-header__drop :deep(.srow:hover),
  .app-header__drop :deep(.hrow:hover) { background: var(--color-fill-gray-3); }
  .app-header__drop :deep(.srow:hover .srow__title),
  .app-header__drop :deep(.hrow:hover .hrow__title) { color: inherit; }
}

/* ease-out, до 200 мс: панель выезжает сверху и проявляется, затемнение плавно появляется */
.drop-enter-active { transition: opacity 0.2s ease-out, transform 0.2s ease-out; }
.drop-leave-active { transition: opacity 0.12s ease-out, transform 0.12s ease-out; }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateY(-8px) scale(0.985); }
.scrim-enter-active { transition: opacity 0.2s ease-out; }
.scrim-leave-active { transition: opacity 0.15s ease-out; }
.scrim-enter-from, .scrim-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .drop-enter-active, .drop-leave-active, .scrim-enter-active, .scrim-leave-active { transition: opacity 0.1s linear; }
  .drop-enter-from, .drop-leave-to { transform: none; }
}
</style>
