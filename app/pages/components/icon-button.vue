<script setup lang="ts">
useHead({ title: 'Кнопка-иконка - Kango' })
</script>

<template>
  <ShowPage
    title="Кнопка-иконка"
    hint="Квадрат 44x44, радиус 12px. Favorite и Cancel - круглые 24x24 поверх фото. Обязательный aria-label."
  >
    <ShowSection title="Стрелки" note="Серая обводка 1px. Hover/Selected - серая заливка 10%, Disabled - светло-серая иконка.">
      <ShowItem label="arrow-left / Default"><KIconButton type="arrow-left" label="Назад" /></ShowItem>
      <ShowItem label="arrow-left / Hover"><KIconButton type="arrow-left" label="Назад" selected /></ShowItem>
      <ShowItem label="arrow-left / Disabled"><KIconButton type="arrow-left" label="Назад" disabled /></ShowItem>
      <ShowItem label="arrow-right / Default"><KIconButton type="arrow-right" label="Вперёд" /></ShowItem>
      <ShowItem label="arrow-right / Hover"><KIconButton type="arrow-right" label="Вперёд" selected /></ShowItem>
      <ShowItem label="arrow-right / Disabled"><KIconButton type="arrow-right" label="Вперёд" disabled /></ShowItem>
    </ShowSection>

    <ShowSection title="Шевроны и закрытие" note="Без обводки.">
      <ShowItem label="chevron-left"><KIconButton type="chevron-left" label="Предыдущая" /></ShowItem>
      <ShowItem label="chevron-left / Hover"><KIconButton type="chevron-left" label="Предыдущая" selected /></ShowItem>
      <ShowItem label="chevron-right"><KIconButton type="chevron-right" label="Следующая" /></ShowItem>
      <ShowItem label="chevron-right / Hover"><KIconButton type="chevron-right" label="Следующая" selected /></ShowItem>
      <ShowItem label="close (32px)"><KIconButton type="close" label="Закрыть" /></ShowItem>
      <ShowItem label="close / Hover"><KIconButton type="close" label="Закрыть" selected /></ShowItem>
    </ShowSection>

    <ShowSection title="Фильтр" note="Оранжевая иконка, красная точка, когда фильтры применены.">
      <ShowItem label="Default"><KIconButton type="filter" label="Фильтры" /></ShowItem>
      <ShowItem label="Hover"><KIconButton type="filter" label="Фильтры" selected /></ShowItem>
      <ShowItem label="С точкой"><KIconButton type="filter" label="Фильтры" dot /></ShowItem>
    </ShowSection>

    <ShowSection title="Поверх фото" note="Круглые 24x24: избранное (синее, в избранном - оранжевая заливка) и удаление.">
      <div class="photo">
        <KIconButton type="favorite" label="В избранное" />
        <KIconButton type="favorite" label="В избранном" selected />
        <KIconButton type="cancel" label="Удалить фото" />
      </div>
    </ShowSection>
  </ShowPage>
</template>

<style scoped>
.photo {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: var(--radius-md);
  background: var(--color-fill-gray);
}
</style>
