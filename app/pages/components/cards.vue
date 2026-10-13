<script setup lang="ts">
import work from '~/assets/img/categories/work.webp'
import realEstate from '~/assets/img/categories/real-estate.webp'

useHead({ title: 'Карточки - Kango' })

const fav = ref(false)
</script>

<template>
  <ShowPage title="Карточки" hint="Category card и Ad Card (Home). Размеры подстраиваются под брейкпоинты 375, 768, 1380px, ширину задаёт контейнер.">
    <ShowSection title="Category card" note="Четыре раздела: Работа, Недвижимость, Товары, Услуги. Сейчас ширина контейнера 168px (макет 375px).">
      <ShowItem label="Work" width="168px"><KCategoryCard category="work" title="Работа" caption="1 345 объявлений" to="/components/cards" /></ShowItem>
      <ShowItem label="Real estate" width="168px"><KCategoryCard category="real-estate" title="Недвижимость" caption="1 345 объявлений" to="/components/cards" /></ShowItem>
      <ShowItem label="Goods" width="168px"><KCategoryCard category="goods" title="Товары" caption="1 345 объявлений" to="/components/cards" /></ShowItem>
      <ShowItem label="Services" width="168px"><KCategoryCard category="services" title="Услуги" caption="1 345 объявлений" to="/components/cards" /></ShowItem>
    </ShowSection>

    <ShowSection title="Category card, 1380px" note="Контейнер 194px, пропорции 194x170.">
      <ShowItem label="Work" width="194px"><KCategoryCard category="work" title="Работа" caption="1 345 объявлений" /></ShowItem>
      <ShowItem label="Services" width="194px"><KCategoryCard category="services" title="Услуги" caption="1 345 объявлений" /></ShowItem>
    </ShowSection>

    <ShowSection title="Ad Card (Home)" note="Фото, избранное (24px круг), заголовок, цена SemiBold, город и район.">
      <ShowItem label="375px (168 шириной)" width="168px">
        <KAdCard
          title="2-комнатная квартира"
          price="4 500 ₪"
          location="Хайфа, Хадар"
          :image="realEstate"
          :favorite="fav"
          to="/components/cards"
          @toggle-favorite="fav = !fav"
        />
      </ShowItem>
      <ShowItem label="Без фото" width="168px">
        <KAdCard title="Мастер по ремонту" price="От 150 ₪" location="Тель-Авив" />
      </ShowItem>
      <ShowItem label="В избранном" width="168px">
        <KAdCard title="Курьер на скутере" price="9 000 ₪" location="Иерусалим" :image="work" favorite />
      </ShowItem>
    </ShowSection>
  </ShowPage>
</template>
