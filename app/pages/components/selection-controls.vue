<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Чекбокс, радио, свитч - Kango' })

const a = ref(false)
const b = ref(true)
const services = ref(['work'])
const radio = ref('rent')
const s1 = ref(false)
const s2 = ref(true)
</script>

<template>
  <ShowPage title="Чекбокс, радио, свитч" hint="Контролы выбора 20x20 (свитч 48x24). Нативные input с кастомной отрисовкой, управление с клавиатуры.">
    <ShowSection title="Checkbox" note="Радиус 4px, False - серая обводка 1.5px, True - оранжевая заливка с галочкой.">
      <ShowItem label="False"><KCheckbox v-model="a" /></ShowItem>
      <ShowItem label="True"><KCheckbox v-model="b" /></ShowItem>
      <ShowItem label="С подписью"><KCheckbox v-model="b">Только с фото</KCheckbox></ShowItem>
      <ShowItem label="Disabled"><KCheckbox :model-value="true" disabled>Недоступно</KCheckbox></ShowItem>
      <ShowItem label="Массив значений">
        <div class="col">
          <KCheckbox v-model="services" value="work">Работа</KCheckbox>
          <KCheckbox v-model="services" value="rent">Жильё</KCheckbox>
          <span class="dump">{{ services }}</span>
        </div>
      </ShowItem>
    </ShowSection>

    <ShowSection title="Radio button" note="Круг 20px, выбранный - оранжевая обводка и точка.">
      <ShowItem label="Группа">
        <div class="col">
          <KRadio v-model="radio" name="deal" value="rent">Аренда</KRadio>
          <KRadio v-model="radio" name="deal" value="sale">Продажа</KRadio>
          <KRadio v-model="radio" name="deal" value="swap" disabled>Обмен</KRadio>
        </div>
      </ShowItem>
    </ShowSection>

    <ShowSection title="Switch" note="48x24, выключен - светло-оранжевый трек, включён - оранжевый.">
      <ShowItem label="False"><KSwitch v-model="s1" label="Уведомления" /></ShowItem>
      <ShowItem label="True"><KSwitch v-model="s2" label="Уведомления" /></ShowItem>
      <ShowItem label="С подписью"><KSwitch v-model="s2">Показывать телефон</KSwitch></ShowItem>
      <ShowItem label="Disabled"><KSwitch :model-value="false" disabled label="Недоступно" /></ShowItem>
    </ShowSection>
  </ShowPage>
</template>

<style scoped>
.col { display: flex; flex-direction: column; gap: 12px; }
.dump { font-size: var(--text-12-12); color: var(--color-label-gray); }
</style>
