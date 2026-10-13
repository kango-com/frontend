<script setup lang="ts">
useHead({ title: 'Шапка, подвал, логотип - Kango' })

const query = ref('')
const city = ref('Хайфа')
</script>

<template>
  <ShowPage wide title="Шапка, подвал, логотип" hint="Header (375/768 - логотип и город, строка поиска; 1380 - полная шапка), Footer (375/768), Logo. Меняйте ширину окна, чтобы увидеть адаптацию.">
    <ShowSection title="Logo" note="Цветной и белый (для тёмного фона). Высота задаётся, ширина по пропорциям.">
      <ShowItem label="color, 32px"><KLogo :height="32" /></ShowItem>
      <ShowItem label="color, 50px"><KLogo :height="50" /></ShowItem>
      <ShowItem label="white, 50px"><div class="dark"><KLogo variant="white" :height="50" /></div></ShowItem>
    </ShowSection>

    <ShowSection title="Header" note="Верхний вариант: логотип и город. Нижний: со строкой поиска и кнопкой фильтра. От 1380px - полная шапка с категориями и кнопкой «Найти».">
      <div class="frame">
        <KHeader :city="city" />
      </div>
      <div class="frame">
        <KHeader v-model:search="query" :city="city" with-search filter-dot />
      </div>
    </ShowSection>

    <ShowSection title="Footer" note="375px - стопкой, от 768px - логотип слева, ссылки справа.">
      <div class="frame frame--footer">
        <KFooter />
      </div>
    </ShowSection>
  </ShowPage>
</template>

<style scoped>
.frame { width: 100%; max-width: 1380px; overflow: hidden; border: 1px dashed var(--color-stroke-gray); border-radius: var(--radius-md); }
.frame--footer { max-width: 768px; }
.dark { padding: 12px 16px; border-radius: var(--radius-md); background: var(--color-label-primary); }
</style>
