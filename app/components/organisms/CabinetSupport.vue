<script setup lang="ts">
/** Поддержка в кабинете: обращение с подставленными именем и e-mail. Полноценные тикеты (ТЗ п. 7.3) - отдельная задача */
const auth = useAuthStore()
</script>

<template>
  <section class="csup">
    <CabinetPageHead :title="tr('Поддержка')" />
    <CabinetCard :title="tr('Напишите нам')" :description="tr('Опишите вопрос или проблему, ответим на ваш e-mail. Если вопрос про объявление, укажите его номер.')">
      <FeedbackForm :name="auth.user?.name" :email="auth.user?.email" hide-title />
    </CabinetCard>
    <p class="csup__more">
      {{ tr('Ответы на частые вопросы, контакты и реквизиты') }} - <NuxtLink to="/support">{{ tr('на странице поддержки') }}</NuxtLink>
    </p>
  </section>
</template>

<style scoped>
.csup { display: flex; flex-direction: column; gap: 16px; max-width: 760px; }
.csup__more { margin: 0; color: var(--color-label-secondary); font-size: var(--text-14-16); line-height: 20px; }
.csup__more a { color: var(--color-fill-color-3); }
@media (min-width: 768px) {
  .csup { gap: 20px; }
}
</style>
