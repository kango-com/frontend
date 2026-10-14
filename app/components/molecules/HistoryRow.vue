<script setup lang="ts">
const props = defineProps<{
  text: string
  categoryTitle?: string
}>()

defineEmits<{ select: [], remove: [] }>()
</script>

<template>
  <div class="hrow">
    <button type="button" class="hrow__main" @click="$emit('select')">
      <Icon name="kango:search-24" size="24" class="hrow__icon" />
      <span class="hrow__text">
        <span class="hrow__title">{{ text }}</span>
        <span v-if="categoryTitle" class="hrow__cat">{{ categoryTitle }}</span>
      </span>
    </button>
    <button type="button" class="hrow__remove" :aria-label="`Удалить запрос «${props.text}»`" @click="$emit('remove')">
      <Icon name="kango:close-16" size="16" />
    </button>
  </div>
</template>

<style scoped>
.hrow { display: flex; align-items: center; gap: 8px; min-height: 52px; }
.hrow .hrow__main {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 8px 0;
  border: 0;
  background: none;
  color: var(--color-label-primary);
  text-align: left;
  cursor: pointer;
}
.hrow .hrow__main:focus-visible,
.hrow .hrow__remove:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; border-radius: var(--radius-md); }
.hrow__icon { flex: none; color: var(--color-fill-gray); }
.hrow__text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.hrow__title { font-size: var(--text-16-20); line-height: var(--leading-16-20); overflow-wrap: anywhere; }
.hrow__cat { color: var(--color-label-secondary); font-size: var(--text-12-16); line-height: var(--leading-12-16); }
.hrow .hrow__remove {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: var(--radius-md);
  background: none;
  color: var(--color-fill-gray);
  cursor: pointer;
}
@media (hover: hover) {
  .hrow .hrow__main:hover .hrow__title { color: var(--color-fill-color-4); }
  .hrow .hrow__remove:hover { background: var(--color-fill-gray-3); }
}
</style>
