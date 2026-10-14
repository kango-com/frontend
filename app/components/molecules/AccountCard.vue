<script setup lang="ts">
const { t } = useI18n()

defineProps<{
  /** Вошёл ли пользователь: гостю показываем «Войти» */
  loggedIn?: boolean
}>()
</script>

<template>
  <section class="acc" aria-labelledby="acc-title">
    <h2 id="acc-title" class="acc__title">{{ loggedIn ? t('account.titleUser') : t('account.titleGuest') }}</h2>
    <ul class="acc__list">
      <li>
        <NuxtLink to="/favorites" class="acc__link">
          <span class="acc__icon"><Icon name="kango:heart-16" size="16" /></span>
          {{ t('account.favorites') }}
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/profile" class="acc__link">
          <span class="acc__icon"><Icon name="kango:user-16" size="16" /></span>
          {{ t('account.profile') }}
        </NuxtLink>
      </li>
    </ul>
    <KButton v-if="!loggedIn" class="acc__login" variant="outline" block to="/login">{{ t('account.login') }}</KButton>
  </section>
</template>

<style scoped>
.acc {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  height: 100%;
  padding: 12px;
  border-radius: var(--radius-md);
  background: var(--color-fill-gray-3);
  color: var(--color-label-primary);
}
.acc__title { margin: 0; padding: 4px 0 0 4px; font-size: var(--text-16-16); line-height: var(--leading-16-16); font-weight: var(--font-weight-medium); }
.acc__list { display: flex; flex-direction: column; gap: 0; margin: 0; padding: 0; list-style: none; }
.acc .acc__link { display: flex; align-items: center; gap: 12px; padding: 2px 4px; color: inherit; font-size: var(--text-16-20); text-decoration: none; }
.acc .acc__link:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; border-radius: var(--radius-md); }
.acc__icon { display: inline-flex; flex: none; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: var(--color-fill-white); color: var(--color-fill-color-3); }
.acc .acc__login { margin-top: auto; }
@media (hover: hover) { .acc .acc__link:hover { color: var(--color-fill-color-4); } }
</style>
