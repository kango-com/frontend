<script setup lang="ts">
/** Поле ввода сообщения: растёт по тексту до 6 строк; на компьютере Enter отправляет, Shift+Enter - новая строка */
const props = withDefaults(defineProps<{ disabled?: boolean, maxLength?: number, placeholder?: string }>(), { maxLength: 2000 })
const emit = defineEmits<{ send: [text: string] }>()
const text = defineModel<string>({ default: '' })
const area = ref<HTMLTextAreaElement>()

function grow() {
  const el = area.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 140)}px`
}
watch(text, () => nextTick(grow))

const canSend = computed(() => !props.disabled && !!text.value.trim() && text.value.length <= props.maxLength)
function submit() {
  if (!canSend.value) return
  emit('send', text.value)
  text.value = ''
}
function onKey(e: KeyboardEvent) {
  // на телефоне Enter - перенос строки, отправка кнопкой
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && window.matchMedia('(hover: hover)').matches) {
    e.preventDefault()
    submit()
  }
}
defineExpose({ focus: () => area.value?.focus() })
</script>

<template>
  <form class="ccmp" @submit.prevent="submit">
    <textarea
      ref="area"
      v-model="text"
      class="ccmp__input"
      rows="1"
      :disabled="disabled"
      :maxlength="maxLength"
      :placeholder="placeholder ?? tr('Сообщение')"
      :aria-label="tr('Сообщение')"
      @keydown="onKey"
    />
    <button type="submit" class="ccmp__send" :disabled="!canSend" :aria-label="tr('Отправить')">
      <Icon name="kango:arrow-right-24" size="22" class="ccmp__icon" />
    </button>
  </form>
</template>

<style scoped>
.ccmp { display: flex; align-items: flex-end; gap: 8px; }
.ccmp__input { flex: 1; min-height: 44px; max-height: 140px; padding: 11px 16px; border: var(--border-width) solid var(--color-stroke-gray); border-radius: 22px; background: var(--color-background); color: var(--color-label-primary); font-family: inherit; font-size: var(--text-16-20); line-height: 20px; resize: none; }
.ccmp__input:focus { outline: none; border-color: var(--color-stroke-primary); }
.ccmp__input:disabled { background: var(--color-fill-gray-4); color: var(--color-label-secondary); }
.ccmp__send { display: inline-flex; flex: none; align-items: center; justify-content: center; width: 44px; height: 44px; border: 0; border-radius: 50%; background: var(--color-fill-primary); color: var(--color-label-white); cursor: pointer; transition: background-color 0.15s ease-out; }
.ccmp__send:disabled { background: var(--color-fill-disabled); cursor: default; }
.ccmp__send:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
.ccmp__icon { transform: rotate(-90deg); }
</style>
