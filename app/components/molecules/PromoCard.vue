<script setup lang="ts">
defineProps<{
  title: string
  price: number
  description: string
  selected?: boolean
  /** Плашка выгоды («Экономия 20%») */
  badge?: string
}>()

defineEmits<{ select: [] }>()
</script>

<template>
  <button type="button" class="promo" :class="{ 'promo--on': selected }" role="radio" :aria-checked="!!selected" @click="$emit('select')">
    <span class="promo__head">
      <span class="promo__title">{{ tr(title) }}</span>
      <span v-if="badge" class="promo__badge">{{ tr(badge) }}</span>
    </span>
    <span class="promo__price">{{ price }}&nbsp;₪</span>
    <span class="promo__text">{{ tr(description) }}</span>
  </button>
</template>

<style scoped>
.promo {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  padding: 16px;
  border: var(--border-width) solid var(--color-stroke-gray);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-label-primary);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
}
.promo--on { border-color: var(--color-stroke-primary); border-width: var(--border-width-strong); padding: calc(16px - 0.5px); background: var(--color-fill-tint); }
.promo:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
.promo__head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.promo__title { font-size: var(--text-12-16); line-height: var(--leading-12-16); font-weight: var(--font-weight-medium); letter-spacing: 0.04em; text-transform: uppercase; }
.promo__badge { padding: 2px 8px; border-radius: var(--radius-pill); background: var(--color-fill-primary); color: var(--color-label-white); font-size: var(--text-12-12); }
.promo__price { font-size: 28px; line-height: 28px; font-weight: var(--font-weight-medium); }
.promo__text { color: var(--color-label-secondary); font-size: var(--text-14-16); line-height: var(--leading-14-16); }
@media (hover: hover) { .promo:hover { border-color: var(--color-stroke-primary); } }
</style>
