<script setup lang="ts">
useHead({ title: 'Строки списка и аккордеон - Kango' })

const open1 = ref(false)
const open2 = ref(true)
const picked = ref('haifa')
const check1 = ref(true)
const check2 = ref(false)
const radio = ref('rent')
</script>

<template>
  <ShowPage title="Строки списка и аккордеон" hint="Table View Row (без описания и с описанием), Accordion.">
    <ShowSection title="Table View Row" note="Типы: None, Select, Chevrone, Checkbox, Radio button. 44px, подпись 10/12 под названием.">
      <ShowItem label="None" width="343px">
        <KTableRow label="Хайфа" description="Северный округ">
          <template #icon><Icon name="kango:map-pin-16" size="20" /></template>
        </KTableRow>
      </ShowItem>
      <ShowItem label="Select (выбрано)" width="343px">
        <KTableRow type="select" label="Хайфа" :selected="picked === 'haifa'" @click="picked = 'haifa'" />
      </ShowItem>
      <ShowItem label="Select (не выбрано)" width="343px">
        <KTableRow type="select" label="Тель-Авив" :selected="picked === 'tlv'" @click="picked = 'tlv'" />
      </ShowItem>
      <ShowItem label="Chevrone" width="343px">
        <KTableRow type="chevron" label="Мои объявления" description="3 активных" to="/components" />
      </ShowItem>
      <ShowItem label="Checkbox" width="343px">
        <div class="col">
          <KTableRow v-model="check1" type="checkbox" label="Только с фото" />
          <KTableRow v-model="check2" type="checkbox" label="Без посредников" description="Только от хозяев" />
        </div>
      </ShowItem>
      <ShowItem label="Radio button" width="343px">
        <div class="col">
          <KTableRow v-model="radio" type="radio" name="deal" value="rent" label="Аренда" />
          <KTableRow v-model="radio" type="radio" name="deal" value="sale" label="Продажа" />
        </div>
      </ShowItem>
    </ShowSection>

    <ShowSection title="Accordion" note="Close - плюс, Open - плюс повёрнут в крестик. Содержимое через слот.">
      <ShowItem label="Close" width="343px">
        <KAccordion v-model="open1" title="Как подать объявление?">Нажмите «Подать объявление» и заполните форму.</KAccordion>
      </ShowItem>
      <ShowItem label="Open" width="343px">
        <KAccordion v-model="open2" title="Сколько стоит размещение?">Размещение бесплатное, платные только поднятие и выделение.</KAccordion>
      </ShowItem>
    </ShowSection>
  </ShowPage>
</template>

<style scoped>
.col { display: flex; flex-direction: column; width: 100%; }
</style>
