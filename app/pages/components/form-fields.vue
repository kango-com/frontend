<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Поля ввода - Kango' })

const empty = ref('')
const filled = ref('Иван Петров')
const email = ref('ivan@')
const pass = ref('secret123')
const query = ref('')
const queryFilled = ref('Квартира в Хайфе')
const city = ref('')
const cityFilled = ref('haifa')
const cityClear = ref('tlv')
const cities = [
  { value: 'tlv', label: 'Тель-Авив' },
  { value: 'haifa', label: 'Хайфа' },
  { value: 'jerusalem', label: 'Иерусалим' },
  { value: 'beersheba', label: 'Беэр-Шева' }
]
</script>

<template>
  <ShowPage title="Поля ввода" hint="Text field, Search field, Dropdown. Высота 44px (поиск на 1380px - 52px), радиус 12px, серая обводка 1px, курсор оранжевый.">
    <ShowSection title="Text field" note="Подпись 12/12 под полем. Крестик очищает значение, у пароля - глаз.">
      <ShowItem label="Not filed" width="343px"><KTextField v-model="empty" placeholder="Имя" description="Как к вам обращаться" /></ShowItem>
      <ShowItem label="Filed" width="343px"><KTextField v-model="filled" placeholder="Имя" description="Как к вам обращаться" /></ShowItem>
      <ShowItem label="Password" width="343px"><KTextField v-model="pass" type="password" placeholder="Пароль" description="Не меньше 8 символов" /></ShowItem>
      <ShowItem label="Error" width="343px"><KTextField v-model="email" placeholder="Email" error="Введите корректный email" /></ShowItem>
      <ShowItem label="Disabled" width="343px"><KTextField model-value="Недоступно" disabled /></ShowItem>
    </ShowSection>

    <ShowSection title="Search field" note="Иконка поиска оранжевая, крестик появляется при вводе.">
      <ShowItem label="Not filed" width="291px"><KSearchField v-model="query" placeholder="Что вы ищете?" /></ShowItem>
      <ShowItem label="Filed" width="291px"><KSearchField v-model="queryFilled" /></ShowItem>
    </ShowSection>

    <ShowSection title="Dropdown" note="Нативный select со стилем Kango. Filed+cancel - со сбросом.">
      <ShowItem label="Default" width="343px"><KSelect v-model="city" :options="cities" placeholder="Город" /></ShowItem>
      <ShowItem label="Filed" width="343px"><KSelect v-model="cityFilled" :options="cities" placeholder="Город" /></ShowItem>
      <ShowItem label="Filed + cancel" width="343px"><KSelect v-model="cityClear" :options="cities" placeholder="Город" clearable /></ShowItem>
      <ShowItem label="Disabled" width="343px"><KSelect :options="cities" placeholder="Город" disabled /></ShowItem>
    </ShowSection>
  </ShowPage>
</template>
