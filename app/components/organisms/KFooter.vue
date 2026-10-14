<script setup lang="ts">
export interface FooterLink {
  label: string
  to?: string
  /** Раскрывающийся раздел со ссылками на документы (аккордеон с плюсом) */
  group?: 'documents' | 'details'
}

withDefaults(defineProps<{
  links?: FooterLink[]
  copyright?: string
}>(), {
  links: () => [
    { label: 'О нас', to: '/about' },
    { label: 'Поддержка', to: '/support' },
    { label: 'Документы', group: 'documents' },
    { label: 'Реквизиты', group: 'details' }
  ],
  copyright: '© 2026 kango. Все права защищены'
})

const docs = useDocumentsStore()
const opened = ref<string | null>(null)
const id = useId()

function toggle(group: 'documents' | 'details') {
  opened.value = opened.value === group ? null : group
  if (opened.value) docs.load().then(() => { if (group === 'details') docs.loadRequisites() })
}
const itemsOf = (group: 'documents' | 'details') => (group === 'documents' ? docs.documents : docs.details)
</script>

<template>
  <footer class="kft-footer">
    <div class="kft-footer__inner">
      <KLogo class="kft-footer__logo" to="/" :height="42" />
      <ul class="kft-footer__links">
        <li v-for="l in links" :key="l.label">
          <NuxtLink v-if="l.to" :to="l.to" class="kft-footer__link">
            <span>{{ l.label }}</span>
            <Icon name="kango:arrow-up-right-24" size="24" />
          </NuxtLink>
          <template v-else-if="l.group">
            <button
              type="button"
              class="kft-footer__link kft-footer__link--btn"
              :aria-expanded="opened === l.group"
              :aria-controls="`${id}-${l.group}`"
              @click="toggle(l.group)"
            >
              <span>{{ l.label }}</span>
              <Icon :name="opened === l.group ? 'kango:close-24' : 'kango:plus-24'" size="24" />
            </button>
            <div v-if="l.group === 'details'" v-show="opened === l.group" :id="`${id}-${l.group}`" class="kft-footer__sub">
              <p v-if="docs.requisites" class="kft-footer__req">{{ docs.requisites.sections.map(s => s.text).join('\n\n') }}</p>
              <p v-else-if="docs.listStatus === 'error'" class="kft-footer__note">Не удалось загрузить реквизиты</p>
              <p v-else class="kft-footer__note">Загрузка...</p>
            </div>
            <ul v-else v-show="opened === l.group" :id="`${id}-${l.group}`" class="kft-footer__sub">
              <li v-for="d in itemsOf(l.group)" :key="d.slug">
                <NuxtLink :to="`/documents/${d.slug}`" class="kft-footer__sublink">{{ d.title }}</NuxtLink>
              </li>
              <li v-if="docs.listStatus === 'loading'" class="kft-footer__note">Загрузка...</li>
              <li v-else-if="docs.listStatus === 'error'" class="kft-footer__note">Не удалось загрузить список</li>
            </ul>
          </template>
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
  gap: 32px;
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
.kft-footer__link :deep(.iconify) { color: var(--color-fill-gray); }
.kft-footer__link--btn { width: 100%; padding: 0; border-top: 0; border-inline: 0; background: none; font-family: inherit; text-align: left; cursor: pointer; }
.kft-footer__sub { margin: 0; padding: 0 0 8px; list-style: none; border-bottom: var(--border-width) solid var(--color-separator-gray); }
.kft-footer__sublink { display: block; padding: 6px 0; color: var(--color-label-primary); font-size: var(--text-14-16); line-height: var(--leading-14-16); text-decoration: underline; }
.kft-footer__req { margin: 0; padding: 4px 0 8px; color: var(--color-label-secondary); font-size: var(--text-12-16); line-height: var(--leading-12-16); white-space: pre-line; }
.kft-footer__sublink:hover, .kft-footer__sublink:focus-visible { color: var(--color-fill-color-4); }
.kft-footer__note { padding: 8px 0; color: var(--color-label-gray); font-size: var(--text-12-16); }
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
    grid-template-columns: 124px 1fr;
    column-gap: 40px;
    row-gap: 24px;
    padding: 32px 16px 40px;
  }
  .kft-footer__logo { grid-row: 1 / span 2; }
  .kft-footer__links { grid-column: 2; }
  .kft-footer__copy { grid-column: 2; }
}

/* Desktop: большой логотип слева, список на 505px, копирайт справа сверху */
@media (min-width: 1380px) {
  .kft-footer__inner {
    grid-template-columns: 208px 505px minmax(0, 1fr);
    column-gap: 50px;
    padding: 40px 50px 40px;
    align-items: center;
  }
  .kft-footer__logo { grid-row: 1; align-self: center; }
  .kft-footer__logo :deep(img) { width: auto; height: 56px; }
  .kft-footer__links { grid-column: 2; grid-row: 1; }
  .kft-footer__copy { grid-column: 3; grid-row: 1; align-self: start; text-align: right; }
}
</style>
