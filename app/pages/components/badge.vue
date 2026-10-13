<script setup lang="ts">
useHead({ title: 'Бейдж-счётчик - Kango' })
</script>

<template>
  <ShowPage title="Бейдж-счётчик" hint="Круг 20px с числом (Indicator). Оранжевая заливка, белое число Medium 12/12. Для чисел больше max показывается «99+».">
    <ShowSection title="Indicator">
      <ShowItem label="1"><KBadge :count="1" label="фильтр" /></ShowItem>
      <ShowItem label="12"><KBadge :count="12" label="фильтров" /></ShowItem>
      <ShowItem label="99"><KBadge :count="99" /></ShowItem>
      <ShowItem label="100 (max 99)"><KBadge :count="100" /></ShowItem>
    </ShowSection>

    <ShowSection title="В контексте" note="Фильтр-таб со счётчиком выбранных значений.">
      <ShowItem label="Filter Tab + Badge">
        <KFilterTab active>
          <template #image><KBadge :count="3" label="выбрано" /></template>
          Метро
        </KFilterTab>
      </ShowItem>
    </ShowSection>
  </ShowPage>
</template>
