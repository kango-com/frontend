<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Чипы и вкладки - Kango' })

const city = ref('haifa')
const cities = [
  { id: 'tlv', label: 'Тель-Авив' },
  { id: 'haifa', label: 'Хайфа' },
  { id: 'jerusalem', label: 'Иерусалим' }
]
const section = ref('work')
const chips = ref(['Аренда', 'До 3000', 'С фото'])
const tab = ref('home')
</script>

<template>
  <ShowPage title="Чипы и вкладки" hint="City chips, Filter Tab, Filtr chips, Tabs. Все с состояниями Default и Active/Hover.">
    <ShowSection title="City chips" note="28px, pill, радиус полный. Active - оранжевая обводка и иконка.">
      <ShowItem v-for="c in cities" :key="c.id" :label="c.id === city ? 'Active' : 'Not active'">
        <KCityChip :active="c.id === city" @click="city = c.id">{{ c.label }}</KCityChip>
      </ShowItem>
    </ShowSection>

    <ShowSection title="Filter Tab" note="44px, слот картинки 50x32. Active - оранжевая обводка, заливка 5%.">
      <ShowItem label="Default">
        <KFilterTab :active="section === 'rent'" @click="section = 'rent'">Жильё</KFilterTab>
      </ShowItem>
      <ShowItem label="Active">
        <KFilterTab :active="section === 'work'" @click="section = 'work'">Работа</KFilterTab>
      </ShowItem>
    </ShowSection>

    <ShowSection title="Filtr chips" note="Выбранный фильтр с крестиком, 32px.">
      <ShowItem v-for="c in chips" :key="c" label="Chip">
        <KFilterChip @remove="chips = chips.filter(x => x !== c)">{{ c }}</KFilterChip>
      </ShowItem>
    </ShowSection>

    <ShowSection title="Tabs" note="Иконка 24px и подпись 10/12. Selected - цвет fill-color-4, подпись Medium.">
      <ShowItem label="Default">
        <KTab :selected="tab === 'search'" @click="tab = 'search'">
          <template #icon><Icon name="kango:search-24" size="24" /></template>
          Поиск
        </KTab>
      </ShowItem>
      <ShowItem label="Selected">
        <KTab :selected="tab === 'home'" @click="tab = 'home'">
          <template #icon><Icon name="kango:home-24" size="24" /></template>
          Главная
        </KTab>
      </ShowItem>
      <ShowItem label="Default">
        <KTab :selected="tab === 'fav'" @click="tab = 'fav'">
          <template #icon><Icon name="kango:heart-24" size="24" /></template>
          Избранное
        </KTab>
      </ShowItem>
    </ShowSection>
  </ShowPage>
</template>
