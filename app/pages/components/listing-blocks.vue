<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Блоки списков - Kango' })

const ui = useUiStore()
const sort = ref<'default' | 'date' | 'cheaper' | 'expensive' | 'distance'>('default')
</script>

<template>
  <ShowPage title="Блоки списков" hint="Карточка-строка AdRowCard, кнопка сортировки, шторка SortSheet и панель ListingToolbar. Страницы целиком: /work, /realty, /goods, /services, /search?q=.">
    <ShowSection title="Молекулы">
      <ShowItem label="AdRowCard (работа)">
        <div class="w"><AdRowCard title="Повар в ресторан" price="59 ₪ / час" :tags="['Дневные смены', 'Нужен опыт']" note="Ресторан «Олива»" location="Тель-Авив, Яффо" published="Сегодня, 10:38" to="/ad/1" action="Откликнуться" /></div>
      </ShowItem>
      <ShowItem label="AdRowCard (услуги)">
        <div class="w"><AdRowCard title="Сантехник, замена смесителей" price="от 67 ₪" note="Выезд на дом" location="Тель-Авив" published="Вчера, 18:47" to="/ad/2" action="Связаться" /></div>
      </ShowItem>
      <ShowItem label="SortButton">
        <SortButton label="Сортировка" />
        <SortButton label="Дешевле" active />
      </ShowItem>
    </ShowSection>

    <ShowSection title="Организмы" note="SortSheet: шторка снизу на 375, диалог от 768.">
      <ShowItem label="SortSheet">
        <KButton variant="outline" @click="ui.open('sort')">Открыть сортировку ({{ sort }})</KButton>
        <SortSheet v-model="sort" section="goods" />
      </ShowItem>
    </ShowSection>
  </ShowPage>
</template>

<style scoped>
.w { width: min(100%, 420px); }
</style>
