<script setup lang="ts">
import { CABINET_LINKS } from '~/utils/cabinet'

definePageMeta({ layout: false })
useHead({ title: 'Блоки профиля - Kango' })

const REASON = 'В описании указан номер телефона. Укажите контакты в полях «Телефон», WhatsApp или Telegram.'
</script>

<template>
  <ShowPage title="Блоки профиля" hint="Кабинет: /profile, /profile/ads, /profile/edit, /profile/services, /profile/settings; также /favorites, /viewed, /map. Нужен вход (demo@kango.com / Passw0rd!).">
    <ShowSection title="MyAdCard (молекула)" note="Действия зависят от статуса: активное - продвинуть, редактировать, снять; снятое - опубликовать снова; отклонённое - причина и «Исправить».">
      <ShowItem label="Активно, с опциями">
        <div class="w"><MyAdCard title="3-к. квартира, 94 м2" price="8 000 ₪/мес." location="Тель-Авив, Бен-Йехуда" published="Сегодня, 10:38" to="/ad/1" status="active" :views="1280" active-until="5 дек" promoted-until="12 ноя" highlighted-until="12 ноя" /></div>
      </ShowItem>
      <ShowItem label="На модерации">
        <div class="w"><MyAdCard title="Диван угловой" price="1 200 ₪" location="Хайфа" published="Вчера, 18:47" to="/ad/1" status="moderation" :views="0" /></div>
      </ShowItem>
      <ShowItem label="Отклонено">
        <div class="w"><MyAdCard title="Ремонт стиральных машин" price="от 150 ₪" location="Ашдод" published="2 ноя, 09:15" to="/ad/1" status="rejected" :reject-reason="REASON" /></div>
      </ShowItem>
      <ShowItem label="Снято">
        <div class="w"><MyAdCard title="iPhone 14, 128 ГБ" price="2 300 ₪" location="Нетания" published="28 окт, 12:00" to="/ad/1" status="hidden" :views="87" /></div>
      </ShowItem>
    </ShowSection>

    <ShowSection title="UserAvatar, CabinetNav, CabinetPageHead (молекулы)">
      <ShowItem label="UserAvatar">
        <div class="row"><UserAvatar name="Иван Петров" :size="48" /><UserAvatar name="Иван Петров" :size="88" /></div>
      </ShowItem>
      <ShowItem label="CabinetNav list">
        <div class="w"><CabinetNav :links="CABINET_LINKS" :counts="{ ads: 6, favorites: 3, services: 1 }" variant="list" /></div>
      </ShowItem>
      <ShowItem label="CabinetNav sidebar">
        <div style="width: 280px"><CabinetNav :links="CABINET_LINKS" :counts="{ ads: 6, favorites: 3, services: 1 }" variant="sidebar" /></div>
      </ShowItem>
      <ShowItem label="CabinetCard">
        <div class="w"><CabinetCard title="Уведомления" description="Пояснение к разделу" status="Сохранено"><KSwitch row :model-value="true" description="Когда вам пишут по объявлению">Новые сообщения</KSwitch></CabinetCard></div>
      </ShowItem>
      <ShowItem label="ChatListItem">
        <div class="w"><ChatListItem to="/messages/1" name="Мария Коган" online ad-title="2-к. квартира, Хайфа" preview="Да, в 12:00 удобно?" time="14:05" :unread="2" /></div>
      </ShowItem>
      <ShowItem label="ChatBubble">
        <div class="w col">
          <ChatBubble text="Здравствуйте! Квартира ещё сдаётся?" time="10:38" mine read />
          <ChatBubble text="Да, свободна с 1 декабря." time="10:41" reportable />
          <ChatBubble text="Можно посмотреть в субботу?" time="10:42" mine state="failed" />
        </div>
      </ShowItem>
      <ShowItem label="ChatComposer">
        <div class="w"><ChatComposer /></div>
      </ShowItem>
      <ShowItem label="CabinetPageHead">
        <div class="w"><CabinetPageHead title="Мои объявления" /></div>
      </ShowItem>
    </ShowSection>
  </ShowPage>
</template>

<style scoped>
.w { width: min(100%, 420px); }
.row { display: flex; align-items: center; gap: 16px; }
.col { display: flex; flex-direction: column; gap: 6px; }
</style>
