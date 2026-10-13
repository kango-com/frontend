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
const search = ref('')

function submit(q: string) {
  router.push({ path: '/search', query: q ? { q } : undefined })
}
</script>

<template>
  <div class="app-header" :class="{ 'app-header--solid': solid }">
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
.app-header--solid { background: var(--color-background); }

/* На desktop шапка всегда залита */
@media (min-width: 1380px) {
  .app-header { background: var(--color-background); }
}
</style>
