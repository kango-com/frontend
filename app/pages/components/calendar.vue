<script setup lang="ts">
useHead({ title: 'Календарь - Kango' })

const ru = ref('2026-10-15')
const he = ref('')
const limited = ref('')
</script>

<template>
  <ShowPage title="Календарь" hint="Выбор одного дня. Сегодня - серый квадрат, выбранный день - оранжевый, недоступные - серый текст. Локали: русский (неделя с понедельника) и иврит (с воскресенья, справа налево). Клавиатура: стрелки, Home/End, PageUp/PageDown, Enter.">
    <ShowSection title="Русский" note="Все цифры и подписи через Intl, месяц и дни недели локализуются.">
      <ShowItem label="Выбрано 15 октября" width="343px"><KCalendar v-model="ru" locale="ru" today="2026-10-13" /></ShowItem>
      <ShowItem label="Значение" width="160px"><span class="dump">{{ ru || 'не выбрано' }}</span></ShowItem>
    </ShowSection>

    <ShowSection title="עברית" note="Направление справа налево, первый день недели воскресенье, стрелки зеркалятся.">
      <ShowItem label="Иврит, ничего не выбрано" width="343px"><KCalendar v-model="he" locale="he" today="2026-10-13" /></ShowItem>
      <ShowItem label="Значение" width="160px"><span class="dump">{{ he || 'не выбрано' }}</span></ShowItem>
    </ShowSection>

    <ShowSection title="Ограничение диапазона" note="min 10 октября, max 20 октября. Остальные дни недоступны.">
      <ShowItem label="min / max" width="343px"><KCalendar v-model="limited" min="2026-10-10" max="2026-10-20" today="2026-10-13" /></ShowItem>
    </ShowSection>
  </ShowPage>
</template>

<style scoped>
.dump { font-size: var(--text-14-16); color: var(--color-fill-gray); }
</style>
