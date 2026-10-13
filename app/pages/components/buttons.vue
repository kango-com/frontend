<script setup lang="ts">
useHead({ title: 'Кнопки - Kango' })

const solid = ['primary', 'secondary', 'outline', 'neutral'] as const
</script>

<template>
  <ShowPage
    title="Кнопки"
    hint="Primary, Secondary, Outline, Neutral, Plain. Высота 44px, на 1380px и шире 52px. Состояния: Default, Hover/Selected, Disabled."
  >
    <ShowSection v-for="v in solid" :key="v" :title="v[0]!.toUpperCase() + v.slice(1)">
      <ShowItem label="Default" width="341px"><KButton :variant="v" block>Продолжить</KButton></ShowItem>
      <ShowItem v-if="v === 'primary' || v === 'outline'" label="Hover / Selected" width="341px"><KButton :variant="v" block selected>Продолжить</KButton></ShowItem>
      <ShowItem label="Disabled" width="341px"><KButton :variant="v" block disabled>Продолжить</KButton></ShowItem>
      <ShowItem v-if="v === 'secondary' || v === 'outline'" label="С иконкой (1380)" width="341px">
        <KButton :variant="v" block>
          <template #icon-left><Icon name="kango:plus-24" size="24" /></template>
          Добавить
        </KButton>
      </ShowItem>
    </ShowSection>

    <ShowSection title="Plain" note="Medium 17/20 и Small 15/16, без заливки. Hover/Selected - серая заливка 10%.">
      <ShowItem label="Medium / Default"><KButton variant="plain">Отмена</KButton></ShowItem>
      <ShowItem label="Medium / Hover"><KButton variant="plain" selected>Отмена</KButton></ShowItem>
      <ShowItem label="Medium / Disabled"><KButton variant="plain" disabled>Отмена</KButton></ShowItem>
      <ShowItem label="Small / Default"><KButton variant="plain" size="sm">Сбросить</KButton></ShowItem>
      <ShowItem label="Small / Hover"><KButton variant="plain" size="sm" selected>Сбросить</KButton></ShowItem>
      <ShowItem label="Small / Disabled"><KButton variant="plain" size="sm" disabled>Сбросить</KButton></ShowItem>
    </ShowSection>

    <ShowSection title="Plain + icon left" note="Иконка слева в цвете fill-color (выбор города в шапке).">
      <ShowItem label="Default">
        <KButton variant="plain">
          <template #icon-left><Icon name="kango:map-pin-16" size="16" /></template>
          Хайфа
        </KButton>
      </ShowItem>
      <ShowItem label="Hover / Selected">
        <KButton variant="plain" selected>
          <template #icon-left><Icon name="kango:map-pin-16" size="16" /></template>
          Хайфа
        </KButton>
      </ShowItem>
    </ShowSection>

    <ShowSection title="Ссылка и ширина" note="Props to и href превращают кнопку в ссылку, block растягивает на всю ширину.">
      <ShowItem label="to=/components" width="200px"><KButton to="/components" block>Все компоненты</KButton></ShowItem>
    </ShowSection>
  </ShowPage>
</template>
