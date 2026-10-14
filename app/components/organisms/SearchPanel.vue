<script setup lang="ts">
/** Экран поиска: поле с «Отмена», история или подсказки. Тап на строку или Enter ведут к результатам. */
const router = useRouter()
const search = useSearchStore()

const query = ref('')
const list = ref<{ focusFirst: () => void }>()
const field = ref<{ $el: HTMLElement }>()

// на desktop поиск живёт в шапке (своя строка у панели скрыта), фокус ставим только на мобильном и планшете
onMounted(() => {
  if (window.innerWidth < 1380) field.value?.$el.querySelector('input')?.focus()
})

async function go(text: string, categoryTitle?: string) {
  const value = text.trim()
  if (!value) return
  await search.submit(value, categoryTitle)
  // replace: пустой экран поиска не остаётся в истории, «назад» с результатов ведёт туда, откуда пришли
  await router.replace({ path: '/search', query: { q: value } })
}

function cancel() {
  if (window.history.state?.back) router.back()
  else router.push('/')
}
</script>

<template>
  <section class="spanel" aria-labelledby="spanel-title" @keydown.esc="cancel">
    <h1 id="spanel-title" class="spanel__title">{{ tr('Поиск объявлений') }}</h1>
    <div class="spanel__bar">
      <KSearchField
        ref="field"
        v-model="query"
        class="spanel__field"
        :placeholder="tr('Что вы ищете?')"
        :label="tr('Что вы ищете?')"
        @submit="go"
        @keydown.down.prevent="list?.focusFirst()"
      />
      <KTextButton size="md" @click="cancel">{{ tr('Отмена') }}</KTextButton>
    </div>
    <SearchSuggest ref="list" :query="query" @pick="go" />
  </section>
</template>

<style scoped>
.spanel { display: flex; flex-direction: column; gap: 12px; padding-block: 12px 24px; }
.spanel__title { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.spanel__bar { display: flex; align-items: center; gap: 12px; }
.spanel .spanel__field { flex: 1; min-width: 0; }
@media (min-width: 1380px) {
  .spanel__bar { display: none; }
  .spanel { max-width: 720px; margin-inline: auto; padding-block: 32px 48px; }
}
</style>
