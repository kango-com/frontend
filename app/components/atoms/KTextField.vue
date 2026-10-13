<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: string
  type?: 'text' | 'password' | 'email' | 'tel' | 'url' | 'number'
  placeholder?: string
  /** Подпись под полем (12/12) */
  description?: string
  /** Текст ошибки: красная обводка и сообщение вместо подписи */
  error?: string
  /** Доступное имя, если поле без видимой подписи */
  label?: string
  name?: string
  autocomplete?: string
  disabled?: boolean
  clearable?: boolean
}>(), { modelValue: '', type: 'text', clearable: true })

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const id = useId()
// class и style остаются на корне, остальные атрибуты (required, maxlength, @blur и т.д.) уходят на нативный элемент
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const nativeAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})
const input = ref<HTMLInputElement>()
const revealed = ref(false)

const isPassword = computed(() => props.type === 'password')
const inputType = computed(() => (isPassword.value && revealed.value ? 'text' : props.type))
const note = computed(() => props.error || props.description)

function clear() {
  emit('update:modelValue', '')
  input.value?.focus()
}
</script>

<template>
  <div class="ktf" :class="[attrs.class, { 'ktf--error': error, 'ktf--disabled': disabled }]" :style="attrs.style as any">
    <div class="ktf__field">
      <input
        v-bind="nativeAttrs"
        :id="id"
        ref="input"
        class="ktf__input"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :name="name"
        :autocomplete="autocomplete"
        :disabled="disabled"
        :aria-label="label ?? placeholder"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="note ? `${id}-note` : undefined"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
      <button
        v-if="isPassword"
        type="button"
        class="ktf__action"
        :aria-label="revealed ? 'Скрыть пароль' : 'Показать пароль'"
        :aria-pressed="revealed"
        :disabled="disabled"
        @click="revealed = !revealed"
      >
        <Icon :name="revealed ? 'kango:eye-24' : 'kango:eye-off-24'" size="24" />
      </button>
      <button
        v-else-if="clearable && modelValue && !disabled"
        type="button"
        class="ktf__action"
        aria-label="Очистить"
        @click="clear"
      >
        <Icon name="kango:close-24" size="24" />
      </button>
    </div>
    <p v-if="note" :id="`${id}-note`" class="ktf__note" :role="error ? 'alert' : undefined">{{ note }}</p>
  </div>
</template>

<style scoped>
.ktf { display: flex; flex-direction: column; gap: 2px; width: 100%; }
.ktf__field {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 10px 0 16px;
  border: var(--border-width) solid var(--color-stroke-gray);
  border-radius: var(--radius-md);
  background: var(--color-fill-white);
  transition: border-color 0.15s ease-out;
}
.ktf__field:focus-within { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
.ktf__input {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  caret-color: var(--color-fill-primary);
  color: var(--color-label-primary);
  font-size: var(--text-16-16);
  line-height: var(--leading-16-16);
}
.ktf__input::placeholder { color: var(--color-label-secondary); opacity: 1; }
.ktf__action {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-fill-gray);
  cursor: pointer;
}
.ktf__action:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); border-radius: var(--radius-sm); }
.ktf__note {
  margin: 0;
  color: var(--color-label-hint);
  font-family: var(--font-sans-tight);
  font-size: var(--text-12-12);
  line-height: var(--leading-12-12);
}
.ktf--error .ktf__field { border-color: var(--color-fill-error); }
.ktf--error .ktf__note { color: var(--color-fill-error); }
.ktf--disabled .ktf__field { background: var(--color-fill-gray-3); }
.ktf--disabled .ktf__input { color: var(--color-label-gray); cursor: not-allowed; }
</style>
