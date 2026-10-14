<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Блоки профиля - Kango' })
</script>

<template>
  <ShowPage title="Блоки профиля" hint="Карточка «Моё объявление». Страницы: /profile, /favorites, /viewed, /map (нужен вход для профиля и избранного).">
    <ShowSection title="Молекулы">
      <ShowItem label="MyAdCard">
        <div class="w"><MyAdCard title="3-к. квартира, 94 м2" price="8 000 ₪/мес." location="Тель-Авив, Бен-Йехуда" published="Сегодня, 10:38" to="/ad/1" promoted /></div>
      </ShowItem>
    </ShowSection>
  </ShowPage>
</template>

<style scoped>
.w { width: min(100%, 420px); }
</style>
