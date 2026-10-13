<script setup lang="ts">
type IconButtonType =
  | 'arrow-left' | 'arrow-right'
  | 'chevron-left' | 'chevron-right'
  | 'close' | 'filter' | 'favorite' | 'cancel'

const props = defineProps<{
  type: IconButtonType
  /** Доступное имя кнопки (aria-label), обязательно */
  label: string
  disabled?: boolean
  /** Принудительно показать Hover/Selected. Для favorite - добавлено в избранное */
  selected?: boolean
  /** Только filter: красная точка (фильтры применены) */
  dot?: boolean
}>()

const icons: Record<Exclude<IconButtonType, 'favorite'>, { name: string; size: number }> = {
  'arrow-left': { name: 'arrow-left-24', size: 24 },
  'arrow-right': { name: 'arrow-right-24', size: 24 },
  'chevron-left': { name: 'chevron-left-24', size: 24 },
  'chevron-right': { name: 'chevron-right-24', size: 24 },
  'close': { name: 'close-32', size: 32 },
  'filter': { name: 'sliders-24', size: 24 },
  'cancel': { name: 'close-16', size: 16 }
}

const icon = computed(() => (props.type === 'favorite' ? null : icons[props.type]))
const small = computed(() => props.type === 'favorite' || props.type === 'cancel')
</script>

<template>
  <button
    type="button"
    class="kib"
    :class="[`kib--${type}`, { 'kib--small': small, 'kib--selected': selected }]"
    :disabled="disabled"
    :aria-label="label"
    :aria-pressed="type === 'favorite' ? !!selected : undefined"
  >
    <svg v-if="type === 'favorite'" class="kib__heart" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <g transform="translate(-125 -21.67)">
        <path
          d="M131.939 34.9785C130.058 33.5719 126.332 30.3565 126.332 27.463C126.332 25.5504 127.736 24 129.665 24C130.665 24 131.665 24.3333 132.999 25.6667C134.332 24.3333 135.332 24 136.332 24C138.262 24 139.665 25.5504 139.665 27.463C139.665 30.3565 135.939 33.5719 134.058 34.9785C133.425 35.4517 132.572 35.4517 131.939 34.9785Z"
          :fill="selected ? 'currentColor' : 'none'"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </svg>
    <Icon v-else-if="icon" :name="`kango:${icon.name}`" :size="icon.size" />
    <span v-if="type === 'filter' && dot" class="kib__dot" aria-hidden="true" />
  </button>
</template>

<style scoped>
.kib {
  position: relative;
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-fill-gray);
  cursor: pointer;
  transition: background-color 0.15s ease-out, color 0.15s ease-out;
}
.kib:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }

/* Со стрелками и фильтром есть серая обводка */
.kib--arrow-left,
.kib--arrow-right,
.kib--filter { border: var(--border-width) solid var(--color-stroke-gray); }
.kib--filter { background: var(--color-fill-white); color: var(--color-fill-primary); }

.kib--selected:not(.kib--small),
.kib--selected.kib--filter { background: var(--color-fill-gray-10); }
.kib--filter.kib--selected { background: linear-gradient(var(--color-fill-gray-10), var(--color-fill-gray-10)), var(--color-fill-white); }

/* Маленькие круглые кнопки поверх фото */
.kib--small {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-fill-white);
}
.kib--favorite { color: var(--color-fill-color); }
.kib--favorite.kib--selected { color: var(--color-fill-primary); }

.kib__dot {
  position: absolute;
  top: 9px;
  right: 9px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-fill-error);
}

@media (hover: hover) {
  .kib:not(:disabled):not(.kib--small):hover { background: var(--color-fill-gray-10); }
  .kib--filter:not(:disabled):hover { background: linear-gradient(var(--color-fill-gray-10), var(--color-fill-gray-10)), var(--color-fill-white); }
  .kib--favorite:not(:disabled):hover { color: var(--color-fill-primary); }
}

.kib:disabled { color: var(--color-stroke-gray); cursor: not-allowed; }
</style>
