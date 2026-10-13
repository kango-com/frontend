<script setup lang="ts">
useHead({ title: 'Слайдер и сегмент-контроль - Kango' })

const value = ref(25)
const range = ref<[number, number]>([20, 60])
const segment2 = ref('rent')
const segment3 = ref('all')
</script>

<template>
  <ShowPage title="Слайдер и сегмент-контроль" hint="Слайдер: дорожка 2px, бегунок 14px. Сегмент-контроль: контейнер 12px, сегмент 44px.">
    <ShowSection title="Slider Value" note="Одно значение. Управление: мышь, касание, стрелки, Home/End, PageUp/PageDown.">
      <ShowItem label="Value" width="343px"><KSlider v-model="value" label="Цена" show-value /></ShowItem>
    </ShowSection>

    <ShowSection title="Slider Range" note="Диапазон: два бегунка, залитая часть между ними.">
      <ShowItem label="Range" width="343px"><KSlider v-model="range" label="Цена" show-value /></ShowItem>
      <ShowItem label="Disabled" width="343px"><KSlider :model-value="[10, 40]" disabled /></ShowItem>
    </ShowSection>

    <ShowSection title="Segment Controls" note="Option 2 и Option 3. Между невыбранными сегментами - разделитель.">
      <ShowItem label="Option 2" width="341px">
        <KSegmentControl
          v-model="segment2"
          label="Тип сделки"
          :options="[{ value: 'rent', label: 'Аренда' }, { value: 'sale', label: 'Продажа' }]"
        />
      </ShowItem>
      <ShowItem label="Option 3" width="341px">
        <KSegmentControl
          v-model="segment3"
          label="Показывать"
          :options="[{ value: 'all', label: 'Все' }, { value: 'owner', label: 'Хозяин' }, { value: 'agent', label: 'Агент' }]"
        />
      </ShowItem>
    </ShowSection>
  </ShowPage>
</template>

<style scoped>
.dump { font-size: var(--text-14-16); color: var(--color-fill-gray); }
</style>
