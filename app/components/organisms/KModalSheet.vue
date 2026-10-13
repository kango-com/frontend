<script setup lang="ts">
const open = defineModel<boolean>({ default: false })

defineProps<{
  title?: string
  /** Текст кнопки справа в шапке (например «Сбросить») */
  action?: string
  /** Доступное имя окна, если нет заголовка */
  label?: string
}>()

const emit = defineEmits<{ action: [] }>()

const id = useId()
const sheet = ref<HTMLElement>()
const dragY = ref(0)
let startY = 0
let dragging = false
const isDragging = ref(false)
let lastFocus: HTMLElement | null = null

function close() { open.value = false }

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
  if (e.key === 'Tab' && sheet.value) {
    const items = sheet.value.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
    if (!items.length) return
    const first = items[0]!
    const last = items[items.length - 1]!
    const inside = sheet.value.contains(document.activeElement)
    if (!inside) { e.preventDefault(); first.focus() }
    else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }
}

let active = false

async function activate() {
  if (active || !import.meta.client) return
  active = true
  lastFocus = document.activeElement as HTMLElement | null
  document.addEventListener('keydown', onKey)
  document.body.style.overflow = 'hidden'
  await nextTick()
  sheet.value?.querySelector<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])')?.focus()
}

function deactivate() {
  if (!active || !import.meta.client) return
  active = false
  document.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
  lastFocus?.focus()
}

watch(open, (v) => {
  if (v) { dragY.value = 0; activate() } else deactivate()
})

// Шторка могла быть создана сразу открытой (SSR, v-model=true)
onMounted(() => { if (open.value) activate() })
onBeforeUnmount(deactivate)

function dragStart(e: PointerEvent) {
  dragging = true
  isDragging.value = true
  startY = e.clientY
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}
function dragMove(e: PointerEvent) {
  if (dragging) dragY.value = Math.max(0, e.clientY - startY)
}
function dragEnd() {
  if (!dragging) return
  dragging = false
  isDragging.value = false
  // при закрытии сдвиг остаётся: шторка уезжает вниз с текущего положения, при отмене возвращается плавно
  if (dragY.value > 80) close()
  else dragY.value = 0
}
</script>

<template>
  <Teleport to="body">
    <Transition name="ksheet">
      <div v-if="open" class="ksheet" @click.self="close">
        <div
          ref="sheet"
          class="ksheet__panel"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? `${id}-title` : undefined"
          :aria-label="title ? undefined : (label ?? 'Окно')"
          :class="{ 'ksheet__panel--dragging': isDragging }"
          :style="{ '--drag': `${dragY}px` }"
          tabindex="-1"
        >
          <div
            class="ksheet__grabber"
            @pointerdown="dragStart"
            @pointermove="dragMove"
            @pointerup="dragEnd"
            @pointercancel="dragEnd"
          >
            <span />
          </div>
          <div v-if="title || action" class="ksheet__head">
            <KIconButton type="close" label="Закрыть" @click="close" />
            <h2 :id="`${id}-title`" class="ksheet__title">{{ title }}</h2>
            <KTextButton v-if="action" size="sm" @click="emit('action')">{{ action }}</KTextButton>
            <span v-else class="ksheet__spacer" />
          </div>
          <div class="ksheet__body"><slot /></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.ksheet {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: color-mix(in srgb, var(--color-label-primary) 40%, transparent);
}
.ksheet__panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 768px;
  max-height: 90vh;
  max-height: 90dvh;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  background: var(--color-background);
  outline: 0;
  transform: translateY(var(--drag, 0px));
  transition: transform 0.3s ease-out;
}
.ksheet__panel--dragging { transition: none; }
.ksheet__grabber {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  cursor: grab;
  touch-action: none;
}
.ksheet__grabber span { width: 36px; height: 5px; border-radius: var(--radius-sm); background: var(--color-fill-gray-2); }
.ksheet__head { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 0 16px; }
.ksheet__title {
  flex: 1;
  margin: 0;
  color: var(--color-label-primary);
  font-size: var(--text-17-20);
  line-height: var(--leading-17-20);
  font-weight: var(--font-weight-medium);
  text-align: center;
}
.ksheet__spacer { width: 44px; }
.ksheet__body { overflow-y: auto; overscroll-behavior: contain; padding: 8px 16px 24px; }

/* Slide in / out снизу, ease-out, 300ms. Закрытие в обратном направлении */
.ksheet-enter-active,
.ksheet-leave-active { transition: background-color 0.3s ease-out; }
.ksheet-enter-active .ksheet__panel,
.ksheet-leave-active .ksheet__panel { transition: transform 0.3s ease-out; }
.ksheet-enter-from,
.ksheet-leave-to { background: transparent; }
.ksheet-enter-from .ksheet__panel,
.ksheet-leave-to .ksheet__panel { transform: translateY(100%); }
</style>
