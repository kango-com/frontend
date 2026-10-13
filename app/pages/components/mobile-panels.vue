<script setup lang="ts">
useHead({ title: 'Мобильные панели - Kango' })

const search = ref('')
// ?sheet=1 / ?sheet=search открывают шторку сразу (удобно для проверки и скриншотов)
const route = useRoute()
const sheetOpen = ref(route.query.sheet === '1')
const sheetSearchOpen = ref(route.query.sheet === 'search')
const city = ref('haifa')
</script>

<template>
  <ShowPage title="Мобильные панели" hint="Navigation Bar, Tab bar, Action bar, Modal Sheet. Макет 375px, панели занимают ширину контейнера.">
    <ShowSection title="Navigation Bar" note="Типы: Page, Page+Title, Modal (Filtr), Search, Search+Filtr.">
      <ShowItem label="Page" width="375px"><div class="frame"><KNavBar type="page" /></div></ShowItem>
      <ShowItem label="Page + Title" width="375px"><div class="frame"><KNavBar type="page-title" title="Объявление" /></div></ShowItem>
      <ShowItem label="Modal (Filtr)" width="375px"><div class="frame"><KNavBar type="modal" title="Фильтры" action="Сбросить" /></div></ShowItem>
      <ShowItem label="Search" width="375px"><div class="frame"><KNavBar v-model:search="search" type="search" /></div></ShowItem>
      <ShowItem label="Search + Filtr" width="375px"><div class="frame"><KNavBar type="search-filter" filter-dot /></div></ShowItem>
    </ShowSection>

    <ShowSection title="Tab bar" note="Authorization False: последний пункт «Войти», True: «Профиль». Ширина контейнера: 375 и 768px.">
      <ShowItem label="False, 375px" width="375px"><div class="frame"><KTabBar current="home" /></div></ShowItem>
      <ShowItem label="True, 375px" width="375px"><div class="frame"><KTabBar current="favorites" authorized /></div></ShowItem>
      <ShowItem label="768px" width="768px"><div class="frame"><KTabBar current="map" authorized /></div></ShowItem>
    </ShowSection>

    <ShowSection title="Action bar" note="Нижняя панель с главным действием.">
      <ShowItem label="1 button" width="375px">
        <div class="frame"><KActionBar><KButton variant="outline" block>Показать 1 345 объявлений</KButton></KActionBar></div>
      </ShowItem>
      <ShowItem label="Primary" width="375px">
        <div class="frame"><KActionBar><KButton block>Опубликовать</KButton></KActionBar></div>
      </ShowItem>
    </ShowSection>

    <ShowSection title="Modal Sheet" note="Шторка снизу: Esc, клик по подложке, свайп вниз по grabber. Анимация Slide in/out, 300ms, ease-out.">
      <ShowItem label="Default"><KButton @click="sheetOpen = true">Открыть шторку</KButton></ShowItem>
      <ShowItem label="Default + search"><KButton variant="secondary" @click="sheetSearchOpen = true">Выбор города</KButton></ShowItem>
    </ShowSection>

    <KModalSheet v-model="sheetOpen" title="Фильтры" action="Сбросить">
      <KTableRow v-model="city" type="radio" name="sheet-city" value="haifa" label="Хайфа" />
      <KTableRow v-model="city" type="radio" name="sheet-city" value="tlv" label="Тель-Авив" />
      <KButton block class="sheet-btn" @click="sheetOpen = false">Применить</KButton>
    </KModalSheet>

    <KModalSheet v-model="sheetSearchOpen" title="Город">
      <KSearchField v-model="search" placeholder="Поиск города" />
      <KTableRow type="select" label="Хайфа" :selected="city === 'haifa'" @click="city = 'haifa'" />
      <KTableRow type="select" label="Тель-Авив" :selected="city === 'tlv'" @click="city = 'tlv'" />
    </KModalSheet>
  </ShowPage>
</template>

<style scoped>
.frame { width: 100%; max-width: 100%; overflow: hidden; border: 1px dashed var(--color-stroke-gray); border-radius: var(--radius-md); }
.sheet-btn { margin-top: 16px; }
</style>
