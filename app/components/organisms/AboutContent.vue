<script setup lang="ts">
/** «О нас» и «Поддержка»: идея сервиса, контакты, офис, форма «Напишите нам» (тексты и контакты из макета) */
const props = withDefaults(defineProps<{
  /** support: только форма «Напишите нам» */
  variant?: 'about' | 'support'
}>(), { variant: 'about' })

const PHONE = '+972 (3) 123-45-67'
const EMAIL = 'Emailsupport@board.co.il'
const ADDRESS = 'Израиль, Тель-Авив, ул. Ибн Гвироль, 123, этаж 4'
const isAbout = computed(() => props.variant === 'about')
</script>

<template>
  <KContainer as="article" class="about">
    <h1 class="about__title" :class="{ 'about__title--hidden': !isAbout }">{{ isAbout ? 'О нас' : 'Поддержка' }}</h1>

    <div class="about__layout">
      <div class="about__main">
        <section v-if="isAbout" class="about__block" aria-labelledby="why">
          <h2 id="why" class="about__h2">Почему мы создали эту доску объявлений</h2>
          <p>Мы - команда, которая знает, как сложно русскоязычному жителю Израиля быстро найти работу, жильё или мастера. Языковой барьер, незнание местных сервисов, разрозненные группы в соцсетях - всё это отнимает время и нервы. Наша доска объявлений создана для того, чтобы вы могли легко и безопасно публиковать объявления, находить нужное и общаться напрямую через удобные каналы: телефон, WhatsApp, Telegram. Мы не берём плату за размещение. Зарабатываем только на дополнительных опциях - поднятии и выделении объявлений.</p>
          <p>Так мы остаёмся честными перед пользователями.</p>
        </section>

        <FeedbackForm v-if="!isAbout" />
      </div>

      <aside v-if="isAbout" class="about__side" aria-label="Контакты и офис">
        <section class="about__block" aria-labelledby="contacts">
          <h2 id="contacts" class="about__h2">Контакты</h2>
          <ContactInfo :phone="PHONE" :email="EMAIL" />
        </section>
        <section class="about__block" aria-labelledby="office">
          <h2 id="office" class="about__h2">Наш офис</h2>
          <ContactInfo :address="ADDRESS" />
          <OfficeCard :address="ADDRESS" />
        </section>
      </aside>

      <FeedbackForm v-if="isAbout" class="about__form" />
    </div>
  </KContainer>
</template>

<style scoped>
.about { display: flex; flex-direction: column; gap: 16px; padding-block: 16px 40px; }
.about__title { margin: 0; font-size: var(--text-22-24); line-height: var(--leading-22-24); font-weight: var(--font-weight-medium); }
.about__title--hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.about__layout, .about__main, .about__side { display: flex; flex-direction: column; gap: 24px; min-width: 0; }
.about__block { display: flex; flex-direction: column; gap: 12px; }
.about__block p, .about__lead { margin: 0; font-size: var(--text-16-20); line-height: 24px; }
.about__lead { color: var(--color-label-secondary); }
.about__h2 { margin: 0; font-size: var(--text-17-20); line-height: var(--leading-17-20); font-weight: var(--font-weight-medium); }
@media (min-width: 768px) {
  .about__side { flex-direction: row; }
  .about__side > * { flex: 1; }
}
@media (min-width: 1380px) {
  .about { padding-block: 32px 64px; }
  .about__title { font-size: 28px; line-height: 32px; }
  .about__layout { display: grid; grid-template-columns: minmax(0, 720px) 360px; grid-template-areas: 'main side' 'form side'; justify-content: space-between; align-items: start; gap: 24px 48px; }
  .about__main { grid-area: main; }
  .about__side { grid-area: side; flex-direction: column; }
  .about__form { grid-area: form; }
}
</style>
