<script setup lang="ts">
defineProps<{
  /** Подпись для кнопки удаления (aria-label), по умолчанию «Убрать фильтр: текст» */
  removeLabel?: string
}>()

defineEmits<{ remove: [] }>()

const text = ref<HTMLElement>()
const label = ref('')
onMounted(() => { label.value = text.value?.textContent?.trim() ?? '' })
</script>

<template>
  <span class="kfc">
    <span ref="text" class="kfc__label"><slot /></span>
    <button type="button" class="kfc__remove" :aria-label="removeLabel ?? `Убрать фильтр: ${label}`" @click="$emit('remove')">
      <Icon name="kango:close-16" size="16" />
    </button>
  </span>
</template>

<style scoped>
.kfc {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  padding: 0 8px;
  border-radius: var(--radius-md);
  background: var(--color-fill-gray-3);
  color: var(--color-label-primary);
  font-size: var(--text-15-16);
  line-height: var(--leading-15-16);
  white-space: nowrap;
}
.kfc__remove {
  position: relative;
  display: inline-flex;
  flex: none;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-label-primary);
  cursor: pointer;
}
.kfc__remove::after { content: ''; position: absolute; inset: -4px; }
.kfc__remove:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); border-radius: var(--radius-sm); }
</style>
