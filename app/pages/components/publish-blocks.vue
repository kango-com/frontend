<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Блоки подачи - Kango' })

const text = ref('')
const address = ref('')
const picked = ref('raise')
</script>

<template>
  <ShowPage title="Блоки подачи объявления" hint="Молекулы и организмы подачи. Весь сценарий: /new (нужен вход, демо demo@kango.com / Passw0rd!).">
    <ShowSection title="Молекулы">
      <ShowItem label="FormSection">
        <div class="w"><FormSection title="Основное"><KTextField placeholder="Назовите объявление" /></FormSection></div>
      </ShowItem>
      <ShowItem label="DescriptionField (счётчик, генерация)">
        <div class="w"><DescriptionField v-model="text" /></div>
      </ShowItem>
      <ShowItem label="AddressField (подсказки улиц)">
        <div class="w"><AddressField v-model="address" :suggestions="['Дизенгоф', 'Ибн Гвироль', 'Алленби']" /></div>
      </ShowItem>
      <ShowItem label="PromoCard">
        <div class="w">
          <PromoCard title="Поднять" :price="49" description="Поднимем в начало ленты на 7 дней" :selected="picked === 'raise'" @select="picked = 'raise'" />
          <PromoCard title="Пакет «Максимум»" :price="99" description="Поднятие + выделение" badge="Экономия 20%" :selected="picked === 'max'" @select="picked = 'max'" />
        </div>
      </ShowItem>
    </ShowSection>
    <ShowSection title="Организмы">
      <ShowItem label="SectionPicker"><SectionPicker /></ShowItem>
      <ShowItem label="PublishSuccess"><PublishSuccess promoted ad-id="demo" /></ShowItem>
    </ShowSection>
  </ShowPage>
</template>

<style scoped>
.w { display: flex; flex-direction: column; gap: 12px; width: min(100%, 420px); }
</style>
