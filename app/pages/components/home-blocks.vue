<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Блоки главной - Kango' })

import type { AdCard, City } from '~/types'

const sections = useSectionsStore()
await useAsyncData('showcase-sections', async () => { await sections.load(['tel-aviv']); return null })

const query = ref('')
const cities: City[] = [{ id: 'tel-aviv', name: 'Тель-Авив' }, { id: 'haifa', name: 'Хайфа' }, { id: 'jerusalem', name: 'Иерусалим' }, { id: 'netanya', name: 'Нетания' }]
const active = ref('tel-aviv')

const now = new Date().toISOString()
const items: AdCard[] = [
  { id: 'a1', section: 'goods', title: 'iPhone 14 Pro Max', price: { amount: 3800, currency: 'ILS' }, location: 'Тель-Авив, центр', createdAt: now },
  { id: 'a2', section: 'realty', title: 'Сдам 2-комнатную квартиру', price: { amount: 4500, currency: 'ILS', period: 'month' }, location: 'Тель-Авив, Яффо', createdAt: now },
  { id: 'a3', section: 'work', title: 'Помощник официанта', price: { amount: 42, currency: 'ILS', period: 'hour' }, location: 'Хайфа, центр', createdAt: now },
  { id: 'a4', section: 'services', title: 'Уборка квартир и офисов', price: { amount: 65, currency: 'ILS', from: true }, location: 'Реховот', createdAt: now }
]
</script>

<template>
  <ShowPage wide title="Блоки главной" hint="Молекулы и организмы, из которых собрана главная страница. Меняйте ширину окна: 375, 768, 1380, 1920.">
    <ShowSection title="SearchBar (молекула)" note="Поле поиска и кнопка фильтра.">
      <ShowItem label="Default" width="343px"><SearchBar v-model="query" /></ShowItem>
      <ShowItem label="Фильтры применены" width="343px"><SearchBar v-model="query" filter-dot /></ShowItem>
    </ShowSection>

    <ShowSection title="CityChips (молекула)" note="Чипы городов с горизонтальной прокруткой.">
      <ShowItem label="Выбран Тель-Авив" width="343px"><CityChips :cities="cities" :active-id="active" @select="active = $event.id" /></ShowItem>
    </ShowSection>

    <ShowSection title="AccountCard (молекула)" note="Карточка «Что доступно после входа» для гостя и «Ваш аккаунт» после входа, показывается на 1380 и выше.">
      <div style="width: 246px; height: 200px"><AccountCard /></div>
      <div style="width: 246px; height: 200px"><AccountCard logged-in /></div>
    </ShowSection>

    <ShowSection title="SectionsGrid (организм)" note="Разделы с количеством объявлений: 2x2 на 375, 4 в ряд на 768, 5 в ряд на 1380 и выше (пятая карточка про аккаунт).">
      <div class="full"><SectionsGrid /></div>
    </ShowSection>

    <ShowSection title="AdsFeed (организм)" note="Лента: данные, загрузка (скелетоны), пусто, ошибка.">
      <div class="full"><AdsFeed title="Рекомендации" :items="items" status="success" :has-more="true" /></div>
      <div class="full"><AdsFeed title="Загрузка" :items="[]" status="loading" :skeletons="5" /></div>
      <div class="full"><AdsFeed title="Пусто" :items="[]" status="success" /></div>
      <div class="full"><AdsFeed title="Ошибка" :items="[]" status="error" :error="{ status: 500, code: 'server', message: 'Сервер временно недоступен' }" /></div>
    </ShowSection>
  </ShowPage>
</template>

<style scoped>
.full { width: 100%; }
</style>
