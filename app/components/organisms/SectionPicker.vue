<script setup lang="ts">
import type { Section } from '~/types'

const emit = defineEmits<{ pick: [section: Section] }>()

const SECTIONS: { id: Section, title: string, hint: string }[] = [
  { id: 'work', title: 'Работа', hint: 'Вакансии и поиск сотрудников' },
  { id: 'realty', title: 'Недвижимость', hint: 'Аренда и продажа' },
  { id: 'goods', title: 'Товары', hint: 'Новые и б/у вещи' },
  { id: 'services', title: 'Услуги', hint: 'Мастера и специалисты' }
]
const selected = ref<Section | ''>('')
</script>

<template>
  <section class="spick" aria-labelledby="spick-title">
    <h1 id="spick-title" class="spick__title">Подать объявление</h1>
    <p class="spick__lead">Выберите раздел из доступных</p>
    <div class="spick__list" role="radiogroup" aria-labelledby="spick-title">
      <button
        v-for="s in SECTIONS"
        :key="s.id"
        type="button"
        class="spick__item"
        :class="{ 'spick__item--on': selected === s.id }"
        role="radio"
        :aria-checked="selected === s.id"
        @click="selected = s.id"
      >
        <span class="spick__name">{{ s.title }}</span>
        <span class="spick__hint">{{ s.hint }}</span>
      </button>
    </div>
    <KButton block :disabled="!selected" @click="selected && emit('pick', selected)">Классическая подача</KButton>
  </section>
</template>

<style scoped>
.spick { display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 560px; margin-inline: auto; padding: 24px 16px 40px; }
.spick__title { margin: 0; font-size: var(--text-22-24); line-height: var(--leading-22-24); font-weight: var(--font-weight-medium); }
.spick__lead { margin: -8px 0 0; color: var(--color-label-secondary); font-size: var(--text-16-20); }
.spick__list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.spick__item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  border: var(--border-width) solid var(--color-stroke-gray);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-label-primary);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
}
.spick__item--on { border-color: var(--color-stroke-primary); background: var(--color-fill-tint); }
.spick__item:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
.spick__name { font-size: var(--text-17-20); line-height: var(--leading-17-20); font-weight: var(--font-weight-medium); }
.spick__hint { color: var(--color-label-secondary); font-size: var(--text-12-16); line-height: var(--leading-12-16); }
@media (hover: hover) { .spick__item:hover { border-color: var(--color-stroke-primary); } }
</style>
