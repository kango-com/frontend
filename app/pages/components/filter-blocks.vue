<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Блоки фильтров - Kango' })

const ui = useUiStore()
const chips = ref(['Повар', 'Официант', 'Курьер', 'Грузчик', 'Продавец'].map(label => ({ id: label, label })))
const from = ref<number | undefined>()
const to = ref<number | undefined>(5000)
const one = ref<string | string[] | undefined>('any')
const many = ref<string | string[] | undefined>(['day'])
const picked = ref<string[]>([])
const items = [{ id: 'a', title: 'High-Tech / IT' }, { id: 'b', title: 'Продажи и обслуживание клиентов' }, { id: 'c', title: 'Строительство' }]
</script>

<template>
  <ShowPage title="Блоки фильтров" hint="Универсальные молекулы и организмы фильтров. Поля разделов описаны схемой (utils/filter-schema), панель собирается по ней.">
    <ShowSection title="Молекулы">
      <ShowItem label="FilterRow">
        <div class="w"><FilterRow label="Категория" value="Дизайн и Маркетинг" /></div>
        <div class="w"><FilterRow label="Должность" placeholder="Любая" /></div>
        <div class="w"><FilterRow label="Бренд" placeholder="Любой" disabled /></div>
      </ShowItem>
      <ShowItem label="ChipsSummary (больше трёх: «Показать еще»)">
        <div class="w"><ChipsSummary :items="chips" @remove="id => chips = chips.filter(c => c.id !== id)" /></div>
      </ShowItem>
      <ShowItem label="RangeFields">
        <div class="w"><RangeFields v-model:from="from" v-model:to="to" label="Зарплата" unit="₪" /></div>
      </ShowItem>
      <ShowItem label="ToggleGroup (один и несколько)">
        <div class="w">
          <ToggleGroup v-model="one" label="Иврит" :options="[{ value: 'any', label: 'Не важно' }, { value: 'required', label: 'Требуется иврит' }, { value: 'none', label: 'Без иврита' }]" />
          <ToggleGroup v-model="many" multiple label="Тип графика" :options="[{ value: 'day', label: 'Дневные смены' }, { value: 'night', label: 'Ночные смены' }, { value: 'flex', label: 'Гибкий график' }]" />
        </div>
      </ShowItem>
    </ShowSection>

    <ShowSection title="Организмы">
      <ShowItem label="PickerView (список с поиском)">
        <div class="w"><PickerView v-model="picked" :items="items" multiple any-label="Любая" search-placeholder="Поиск категории" /></div>
      </ShowItem>
      <ShowItem label="FilterPanel (на 375 во весь экран, от 768 справа)">
        <KButton variant="outline" @click="ui.open('filters')">Открыть фильтры</KButton>
        <FilterPanel />
      </ShowItem>
    </ShowSection>
  </ShowPage>
</template>

<style scoped>
.w { display: flex; flex-direction: column; gap: 12px; width: min(100%, 420px); }
</style>
