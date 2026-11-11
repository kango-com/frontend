<script setup lang="ts">
export interface FooterLink {
  label: string
  to?: string
  /** Раскрывающийся раздел со ссылками на документы (аккордеон с плюсом) */
  group?: 'documents' | 'details'
}

const { t } = useI18n()

const props = withDefaults(defineProps<{
  links?: FooterLink[]
  copyright?: string
}>(), {
  links: undefined,
  copyright: undefined
})

const footerLinks = computed<FooterLink[]>(() => props.links ?? [
  { label: t('footer.about'), to: '/about' },
  { label: t('footer.support'), to: '/support' },
  { label: tr('Контакты'), to: '/support' },
  { label: t('footer.details'), group: 'details' },
  { label: t('footer.documents'), group: 'documents' }
])
const copyrightText = computed(() => props.copyright ?? t('footer.copyright'))

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
      <div class="kft-footer__brand">
        <KLogo class="kft-footer__logo" to="/" :height="42" />
        <p class="kft-footer__copy">{{ copyrightText }}</p>
      </div>
      <ul class="kft-footer__links">
        <li v-for="l in footerLinks" :key="l.label">
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
              <p v-if="docs.requisites" class="kft-footer__req">{{ docs.requisites.sections.map(s => s.text.split('\n').map(line => tr(line)).join('\n')).join('\n\n') }}</p>
              <p v-else-if="docs.listStatus === 'error'" class="kft-footer__note">{{ tr('Не удалось загрузить реквизиты') }}</p>
              <p v-else class="kft-footer__note">{{ tr('Загрузка...') }}</p>
            </div>
            <ul v-else v-show="opened === l.group" :id="`${id}-${l.group}`" class="kft-footer__sub">
              <li v-for="d in itemsOf(l.group)" :key="d.slug">
                <NuxtLink :to="`/documents/${d.slug}`" class="kft-footer__sublink">{{ tr(d.title) }}</NuxtLink>
              </li>
              <li v-if="docs.listStatus === 'loading'" class="kft-footer__note">{{ tr('Загрузка...') }}</li>
              <li v-else-if="docs.listStatus === 'error'" class="kft-footer__note">{{ tr('Не удалось загрузить список') }}</li>
            </ul>
          </template>
        </li>
      </ul>
    </div>
  </footer>
</template>

<style scoped>
.kft-footer { background: var(--color-surface); }
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
}

/* 768+: слева логотип с копирайтом под ним, справа пункты меню в строку; списки документов и реквизитов раскрываются вверх */
.kft-footer__brand { display: flex; flex-direction: column; gap: 12px; }
@media (min-width: 768px) {
  .kft-footer__inner {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    padding: 32px 16px 36px;
  }
  .kft-footer__brand { gap: 14px; }
  .kft-footer__copy { text-align: left; }
  .kft-footer__links { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px 28px; }
  .kft-footer__links > li { position: relative; }
  .kft-footer__link { min-height: 40px; gap: 6px; border-bottom: 0; font-size: var(--text-15-16); line-height: var(--leading-15-16); white-space: nowrap; }
  .kft-footer__link :deep(svg) { width: 16px; height: 16px; }
  .kft-footer__link--btn { width: auto; }
  .kft-footer__sub {
    position: absolute;
    right: 0;
    bottom: calc(100% + 8px);
    z-index: 5;
    width: 320px;
    max-height: 60vh;
    overflow-y: auto;
    padding: 12px 16px;
    border: 1px solid color-mix(in srgb, var(--color-label-primary) 8%, transparent);
    border-radius: 20px;
    background: var(--color-fill-white);
    box-shadow: 0 12px 32px color-mix(in srgb, var(--color-label-primary) 14%, transparent);
  }
}

@media (min-width: 1380px) {
  .kft-footer__inner { max-width: 1540px; padding: 40px 50px 44px; }
  .kft-footer__logo :deep(img) { width: auto; height: 48px; }
  .kft-footer__links { gap: 8px 36px; }
  .kft-footer__link { font-size: var(--text-16-20); }
}
</style>
