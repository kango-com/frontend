<script setup lang="ts">
export interface KeyParam {
  icon: string
  label: string
  value: string
}

defineProps<{
  items: KeyParam[]
  /** Доступное имя списка */
  label?: string
}>()
</script>

<template>
  <dl v-if="items.length" class="kp" :aria-label="label ?? tr('Ключевые параметры')">
    <div v-for="i in items" :key="i.label" class="kp__item">
      <img :src="i.icon" class="kp__icon" alt="" width="36" height="36">
      <div class="kp__text">
        <dt class="kp__label">{{ tr(i.label) }}</dt>
        <dd class="kp__value">{{ i.value }}</dd>
      </div>
    </div>
  </dl>
</template>

<style scoped>
.kp {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 12px;
  margin: 0;
  padding: 16px;
  border-radius: 20px;
  background: linear-gradient(100deg, #e4f4f0, #f0f9f6);
}
.kp__item { display: flex; align-items: center; gap: 12px; min-width: 0; }
.kp__icon { flex: none; width: 36px; height: 36px; object-fit: contain; }
.kp__text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.kp__label { color: var(--color-label-secondary); font-size: var(--text-12-16); line-height: var(--leading-12-16); }
.kp__value { margin: 0; color: var(--color-label-primary); font-size: var(--text-15-16); line-height: 18px; font-weight: var(--font-weight-semibold); overflow-wrap: anywhere; }
@media (min-width: 768px) {
  .kp { display: flex; align-items: stretch; justify-content: space-between; gap: 0; padding: 18px 8px; }
  .kp__item { flex: 1 1 0; justify-content: center; padding-inline: 16px; }
  .kp__item + .kp__item { border-inline-start: 1px solid color-mix(in srgb, var(--color-fill-color-3) 22%, transparent); }
}
</style>
