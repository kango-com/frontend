<script setup lang="ts">
import logo from '~/assets/img/kango-logo.svg'

const perks = [
  { icon: 'kango:phone-24', text: 'Быстрый доступ' },
  { icon: 'kango:bell-24', text: 'Уведомления о новых объявлениях' },
  { icon: 'kango:star-outline-24', text: 'Удобно на любом устройстве' }
]
</script>

<template>
  <section class="pwa" :aria-label="tr('Установите Kango на телефон')">
    <div class="pwa__lead">
      <span class="pwa__app" aria-hidden="true"><img :src="logo" alt="" height="56"></span>
      <div class="pwa__text">
        <h2 class="pwa__title">{{ tr('Установите Kango на телефон') }}</h2>
        <p class="pwa__sub">{{ tr('Добавьте на главный экран и пользуйтесь как приложением') }}</p>
      </div>
    </div>
    <ul class="pwa__perks">
      <li v-for="p in perks" :key="p.text" class="pwa__perk">
        <Icon :name="p.icon" size="28" class="pwa__ic" />
        <span>{{ tr(p.text) }}</span>
      </li>
    </ul>
    <KButton class="pwa__btn" to="/support">{{ tr('Узнать как установить') }}</KButton>
  </section>
</template>

<style scoped>
.pwa {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border-radius: 20px;
  background: linear-gradient(100deg, var(--color-fill-tint), color-mix(in srgb, var(--color-fill-tint) 40%, var(--color-page)));
}
.pwa__app img { display: block; height: 56px; max-width: none; }
.pwa__lead { display: flex; align-items: center; gap: 14px; }
.pwa__app { display: block; flex: none; width: 56px; height: 56px; overflow: hidden; border-radius: 14px; line-height: 0; box-shadow: 0 2px 8px color-mix(in srgb, var(--color-label-primary) 10%, transparent); }
.pwa__title { margin: 0; font-size: var(--text-17-20); line-height: var(--leading-17-20); font-weight: var(--font-weight-semibold); }
.pwa__sub { margin: 4px 0 0; color: var(--color-label-secondary); font-size: var(--text-13-16); line-height: var(--leading-13-16); }
.pwa__perks { display: none; margin: 0; padding: 0; list-style: none; }
.pwa__perk { display: flex; align-items: center; gap: 10px; max-width: 170px; color: var(--color-label-primary); font-size: var(--text-12-16); line-height: var(--leading-12-16); }
.pwa__perk { min-height: 40px; }
.pwa__perk .pwa__ic { flex: none; width: 28px; height: 28px; color: var(--color-fill-color-3); }
.pwa__perk span { display: block; }
.pwa .pwa__btn { align-self: flex-start; height: 44px; border-radius: 22px; white-space: nowrap; }
@media (min-width: 1380px) {
  .pwa { flex-direction: row; align-items: center; justify-content: space-between; gap: 32px; padding: 14px 32px 14px 24px; }
  .pwa__perks { display: flex; align-items: center; gap: 36px; }
  .pwa .pwa__btn { align-self: center; }
  .pwa__title { font-size: 20px; line-height: 24px; }
  .pwa__sub { font-size: var(--text-13-16); }
}
</style>
