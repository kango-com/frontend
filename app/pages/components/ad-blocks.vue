<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Блоки объявления - Kango' })

import realty from '~/assets/img/categories/realty.webp'
import goods from '~/assets/img/categories/goods.webp'

const reporting = ref(false)
const fav = ref(false)
</script>

<template>
  <ShowPage title="Блоки объявления" hint="Блоки страницы /ad/:id: галерея, параметры, контакты, автор, жалоба. Страница целиком: откройте любое объявление из списка.">
    <ShowSection title="Молекулы">
      <ShowItem label="Gallery (счётчик, избранное, стрелки от 768)">
        <div class="w"><Gallery :images="[realty, goods]" alt="Пример" :favorite="fav" @toggle-favorite="fav = !fav" /></div>
      </ShowItem>
      <ShowItem label="ParamChips">
        <div class="w"><ParamChips :items="['Квартира', '80 м²', 'Этаж 4 из 10', '3 комнаты', 'Лифт', 'Балкон']" /></div>
      </ShowItem>
      <ShowItem label="ContactBar">
        <div class="w"><ContactBar phone="+972 50 123 45 67" telegram="@kango" whatsapp="+972501234567" /></div>
      </ShowItem>
      <ShowItem label="AuthorCard">
        <AuthorCard name="Иванов Иван" online since="2026-01-31" />
      </ShowItem>
    </ShowSection>

    <ShowSection title="Организмы">
      <ShowItem label="ReportDialog">
        <KButton variant="outline" @click="reporting = true">Пожаловаться</KButton>
        <ReportDialog v-model="reporting" ad-id="demo" />
      </ShowItem>
    </ShowSection>
  </ShowPage>
</template>

<style scoped>
.w { width: min(100%, 420px); }
</style>
