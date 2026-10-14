<script setup lang="ts">
/** Переключатель языка: русский, английский, иврит. Язык хранится в cookie (i18n). */
const { locale, locales, setLocale, t } = useI18n()
const open = ref(false)
const root = ref<HTMLElement>()
const id = useId()

const items = computed(() => (locales.value as { code: 'ru' | 'en' | 'he' }[]).map(l => ({ code: l.code, label: t(`lang.${l.code}`) })))

function pick(code: 'ru' | 'en' | 'he') {
  open.value = false
  if (code !== locale.value) setLocale(code)
}
function onFocusOut(e: FocusEvent) {
  if (!root.value?.contains(e.relatedTarget as Node | null)) open.value = false
}
</script>

<template>
  <div ref="root" class="lang" @focusout="onFocusOut" @keydown.esc="open = false">
    <button type="button" class="lang__btn" :aria-expanded="open" aria-haspopup="listbox" :aria-controls="id" :aria-label="t('lang.label')" @click="open = !open">
      <Icon name="kango:globe-24" size="20" />
      <span class="lang__code">{{ locale.toUpperCase() }}</span>
    </button>
    <ul v-show="open" :id="id" class="lang__list" role="listbox" :aria-label="t('lang.label')">
      <li v-for="i in items" :key="i.code" role="option" :aria-selected="i.code === locale">
        <button type="button" class="lang__item" :class="{ 'lang__item--on': i.code === locale }" :lang="i.code" @click="pick(i.code)">{{ i.label }}</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.lang { position: relative; }
.lang__btn { display: inline-flex; align-items: center; gap: 4px; height: 44px; padding: 0 8px; border: 0; border-radius: var(--radius-md); background: none; color: var(--color-label-primary); font-family: inherit; font-size: var(--text-14-16); cursor: pointer; }
.lang__btn:focus-visible, .lang__item:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
.lang__code { font-weight: var(--font-weight-medium); }
.lang__list { position: absolute; inset-inline-end: 0; top: calc(100% + 4px); z-index: 60; min-width: 140px; margin: 0; padding: 4px; list-style: none; border: var(--border-width) solid var(--color-stroke-gray); border-radius: var(--radius-md); background: var(--color-background); box-shadow: 0 8px 24px color-mix(in srgb, var(--color-label-primary) 12%, transparent); }
.lang__item { width: 100%; padding: 10px 12px; border: 0; border-radius: var(--radius-sm); background: none; color: var(--color-label-primary); font-family: inherit; font-size: var(--text-15-16); text-align: start; cursor: pointer; }
.lang__item--on { background: var(--color-fill-tint); font-weight: var(--font-weight-medium); }
@media (hover: hover) { .lang__item:hover { background: var(--color-fill-gray-3); } }
</style>
