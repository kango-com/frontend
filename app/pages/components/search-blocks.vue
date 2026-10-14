<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Блоки поиска - Kango' })

const query = ref('')
const picked = ref('')
</script>

<template>
  <ShowPage title="Блоки поиска" hint="Строки подсказок и истории, список SearchSuggest и экран SearchPanel. Данные из стора search и мок-API: введите «Те» или «кварт».">
    <ShowSection title="Строки" note="SuggestionRow выделяет введённую часть, HistoryRow удаляется крестиком.">
      <ShowItem label="SuggestionRow">
        <div class="w"><SuggestionRow text="Телевизоры" category-title="Электроника и телефоны" query="Те" /></div>
      </ShowItem>
      <ShowItem label="HistoryRow">
        <div class="w"><HistoryRow text="Аренда квартиры" category-title="Недвижимость" /></div>
      </ShowItem>
    </ShowSection>

    <ShowSection title="SearchSuggest" :note="picked ? `Выбрано: ${picked}` : 'Пустое поле показывает историю (после поисков), ввод подсказки.'">
      <ShowItem label="Список">
        <div class="w">
          <KSearchField v-model="query" placeholder="Что вы ищете?" />
          <SearchSuggest :query="query" @pick="(t) => picked = t" />
        </div>
      </ShowItem>
    </ShowSection>

    <ShowSection title="Экран поиска" note="Полноэкранная версия живёт на странице /search.">
      <ShowItem label="Страница">
        <KButton to="/search" variant="outline">Открыть /search</KButton>
      </ShowItem>
    </ShowSection>
  </ShowPage>
</template>

<style scoped>
.w { display: flex; flex-direction: column; gap: 12px; width: min(100%, 420px); }
</style>
