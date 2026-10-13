<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Текстовые кнопки и ссылки - Kango' })

// Заглушки превью для витрины (серые квадраты)
const placeholder = (c: string) => `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72"><rect width="72" height="72" fill="${c}"/></svg>`)}`
const files = ref([
  { id: '1', url: placeholder('#d2d2d2'), name: 'photo-1' },
  { id: '2', url: placeholder('#ebf4fb'), name: 'photo-2' }
])
function remove(id: string) { files.value = files.value.filter(f => f.id !== id) }
function add(picked: File[]) {
  for (const f of picked) files.value.push({ id: `${Date.now()}-${f.name}`, url: URL.createObjectURL(f), name: f.name })
}
</script>

<template>
  <ShowPage title="Текстовые кнопки и ссылки" hint="Text button, Text button + icon, Link + icon, Attach file.">
    <ShowSection title="Text button" note="Regular 14/16 (на 1380px 15/16). Hover/Selected - цвет fill-color-4.">
      <ShowItem label="Default"><KTextButton>Показать все</KTextButton></ShowItem>
      <ShowItem label="Hover / Selected"><KTextButton selected>Показать все</KTextButton></ShowItem>
      <ShowItem label="Disabled"><KTextButton disabled>Показать все</KTextButton></ShowItem>
      <ShowItem label="Underline"><KTextButton underline>Условия</KTextButton></ShowItem>
    </ShowSection>

    <ShowSection title="Text button + icon" note="Medium 17/20 и Small 14/16 (1380px: 15/16), иконка серая, в Hover оранжево-коричневая.">
      <ShowItem label="Medium / Default">
        <KTextButton size="md"><template #icon-left><Icon name="kango:star-20" size="20" /></template>Избранное</KTextButton>
      </ShowItem>
      <ShowItem label="Medium / Hover">
        <KTextButton size="md" selected><template #icon-left><Icon name="kango:star-20" size="20" /></template>Избранное</KTextButton>
      </ShowItem>
      <ShowItem label="Small / Default">
        <KTextButton><template #icon-right><Icon name="kango:chevron-down-16" size="16" /></template>Сортировка</KTextButton>
      </ShowItem>
      <ShowItem label="Small / Hover">
        <KTextButton selected><template #icon-right><Icon name="kango:chevron-down-16" size="16" /></template>Сортировка</KTextButton>
      </ShowItem>
    </ShowSection>

    <ShowSection title="Link + icon" note="Строка 44px: текст 16/16 и шеврон справа. Hover/Selected в макете не отличается от Default.">
      <ShowItem label="Default" width="343px"><KLinkRow to="/components">Мои объявления</KLinkRow></ShowItem>
    </ShowSection>

    <ShowSection title="Attach file" note="Пустое состояние и состояние с фото (удаление, добавление).">
      <ShowItem label="Default" width="343px"><KAttachFile /></ShowItem>
      <ShowItem label="Attach" width="343px"><KAttachFile :files="files" @remove="remove" @add="add" /></ShowItem>
    </ShowSection>
  </ShowPage>
</template>
