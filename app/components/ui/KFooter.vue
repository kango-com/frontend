<script setup lang="ts">
export interface FooterLink {
  label: string
  to: string
  /** arrow - переход на страницу (стрелка), plus - раскрывающийся раздел */
  icon?: 'arrow' | 'plus'
}

withDefaults(defineProps<{
  links?: FooterLink[]
  copyright?: string
}>(), {
  links: () => [
    { label: 'О нас', to: '/about', icon: 'arrow' },
    { label: 'Поддержка', to: '/support', icon: 'arrow' },
    { label: 'Документы', to: '/documents', icon: 'plus' },
    { label: 'Реквизиты', to: '/details', icon: 'plus' }
  ],
  copyright: '© 2026 kango. Все права защищены'
})
</script>

<template>
  <footer class="kft-footer">
    <div class="kft-footer__inner">
      <KLogo class="kft-footer__logo" to="/" :height="50" />
      <ul class="kft-footer__links">
        <li v-for="l in links" :key="l.to">
          <NuxtLink :to="l.to" class="kft-footer__link">
            <span>{{ l.label }}</span>
            <Icon :name="l.icon === 'plus' ? 'kango:plus-24' : 'kango:arrow-up-right-24'" size="24" />
          </NuxtLink>
        </li>
      </ul>
      <p class="kft-footer__copy">{{ copyright }}</p>
    </div>
  </footer>
</template>

<style scoped>
.kft-footer { background: var(--color-fill-gray-3); }
.kft-footer__inner {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1380px;
  margin: 0 auto;
  padding: 32px 16px;
}
.kft-footer__links { margin: 0; padding: 0; list-style: none; }
.kft-footer__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  border-bottom: var(--border-width) solid var(--color-separator-gray);
  color: var(--color-label-primary);
  font-size: var(--text-16-16);
  line-height: var(--leading-16-16);
  text-decoration: none;
}
.kft-footer__link :deep(.iconify),
.kft-footer__link svg { color: var(--color-fill-gray); }
.kft-footer__link:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
@media (hover: hover) { .kft-footer__link:hover { color: var(--color-fill-color-4); } }
.kft-footer__copy {
  margin: 0;
  color: var(--color-label-secondary);
  font-size: var(--text-12-12);
  line-height: var(--leading-12-12);
  text-align: center;
}

@media (min-width: 768px) {
  .kft-footer__inner {
    display: grid;
    grid-template-columns: 148px 1fr;
    column-gap: 40px;
    row-gap: 24px;
    padding: 32px 16px 40px;
  }
  .kft-footer__logo { grid-row: 1 / span 2; }
  .kft-footer__links { grid-column: 2; }
  .kft-footer__copy { grid-column: 2; }
}
</style>
