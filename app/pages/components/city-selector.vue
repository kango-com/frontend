<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Выбор города - Kango' })

const city = useCityStore()
const ui = useUiStore()
</script>

<template>
  <ShowPage title="Выбор города" hint="Организм CitySelector: на 375px шторка снизу, от 768px диалог по центру. Данные из стора city и мок-API.">
    <ShowSection title="Селектор" note="«Выбрать» применяет город, «Отмена» закрывает без изменений. Поиск по подстроке.">
      <ShowItem label="Текущий город">
        <KButton variant="plain" @click="ui.open('city')">
          <template #icon-left><Icon name="kango:map-pin-16" size="16" /></template>
          {{ city.current.name }}
        </KButton>
      </ShowItem>
    </ShowSection>
    <CitySelector />
  </ShowPage>
</template>
