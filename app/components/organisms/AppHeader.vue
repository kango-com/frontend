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

function onFocusIn(e: FocusEvent) {
  const field = (e.target as HTMLElement).closest('.khd__search')
  if (!field || !root.value) return
  if (window.innerWidth < 1380) return
  const box = field.getBoundingClientRect()
  const host = root.value.getBoundingClientRect()
  dropStyle.value = { left: `${box.left - host.left}px`, top: `${box.bottom - host.top + 4}px`, width: `${box.width}px` }
  suggestOpen.value = true
}
/** Стрелка вниз из поля шапки переводит фокус на первую строку списка */
function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'ArrowDown' || !suggestOpen.value) return
  if (!(e.target as HTMLElement).closest('.khd__search')) return
  const first = root.value?.querySelector<HTMLElement>('.app-header__drop .srow, .app-header__drop .hrow__main')
  if (first) { e.preventDefault(); first.focus() }
}
function onFocusOut(e: FocusEvent) {
  const next = e.relatedTarget as Node | null
  if (!next || !root.value?.contains(next)) suggestOpen.value = false
}
</script>

<template>
  <div ref="root" class="app-header" :class="{ 'app-header--solid': solid }" @focusin="onFocusIn" @focusout="onFocusOut" @keydown.esc="suggestOpen = false" @keydown="onKeydown">
    <KHeader
      v-model:search="search"
      :city="city.current.name"
      :logged-in="auth.isAuthed"
      :with-search="withSearch"
      @city="ui.open('city')"
      @filter="ui.open('filters')"
      @categories="ui.open('menu')"
      @submit="submit"
    />
    <div v-if="suggestOpen" class="app-header__drop" :style="dropStyle" @mousedown.prevent>
      <SearchSuggest :query="search" @pick="submit" />
    </div>
  </div>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: transparent;
  transition: background-color 0.2s ease-out, box-shadow 0.2s ease-out;
}
.app-header :deep(.khd) { background: transparent; transition: background-color 0.2s ease-out; }
.app-header--solid,
.app-header--solid :deep(.khd) { background: var(--color-background); }
.app-header__drop {
  position: absolute;
  z-index: 50;
  max-height: 60dvh;
  overflow-y: auto;
  padding: 8px 16px 12px;
  border: var(--border-width) solid var(--color-stroke-gray);
  border-radius: var(--radius-md);
  background: var(--color-background);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--color-label-primary) 12%, transparent);
}
</style>
