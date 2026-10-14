<script setup lang="ts">
/** «О нас»: идея сервиса, контакты, офис, форма обратной связи. Контакты и адрес пока заглушки (нужны данные владельца). */
const props = withDefaults(defineProps<{
  /** support: страница поддержки без текста об идее */
  variant?: 'about' | 'support'
}>(), { variant: 'about' })

const PHONE = '+972 3 000 00 00'
const EMAIL = 'hello@kango.com'
const ADDRESS = 'Тель-Авив, ул. Ротшильд 1'
const isAbout = computed(() => props.variant === 'about')
</script>

<template>
  <KContainer as="article" class="about">
    <h1 class="about__title">{{ isAbout ? 'О нас' : 'Поддержка' }}</h1>

    <div class="about__layout">
      <div class="about__main">
        <section v-if="isAbout" class="about__block" aria-labelledby="why">
          <h2 id="why" class="about__h2">Почему мы создали эту доску объявлений</h2>
          <p>Kango помогает русскоязычным жителям Израиля находить работу, жильё, товары и мастеров рядом с домом, без лишних посредников и сложных форм.</p>
          <p>Размещать объявления бесплатно. Платными остаются только дополнительные возможности: поднятие в ленте и выделение объявления.</p>
        </section>
        <p v-else class="about__lead">Если что-то не работает или нужна помощь, напишите нам. Обычно отвечаем в течение рабочего дня.</p>

        <FeedbackForm />
      </div>

      <aside class="about__side" aria-label="Контакты">
        <section class="about__block" aria-labelledby="contacts">
          <h2 id="contacts" class="about__h2">Контактные данные</h2>
          <ContactInfo :phone="PHONE" :email="EMAIL" />
        </section>
        <section class="about__block" aria-labelledby="office">
          <h2 id="office" class="about__h2">Наш офис</h2>
          <OfficeCard :address="ADDRESS" hours="Вс-Чт, 9:00-18:00" />
        </section>
      </aside>
    </div>
  </KContainer>
</template>

<style scoped>
.about { display: flex; flex-direction: column; gap: 16px; padding-block: 16px 40px; }
.about__title { margin: 0; font-size: var(--text-22-24); line-height: var(--leading-22-24); font-weight: var(--font-weight-medium); }
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
  .about__layout { display: grid; grid-template-columns: minmax(0, 720px) 360px; justify-content: space-between; align-items: start; gap: 48px; }
  .about__side { flex-direction: column; }
}
</style>
