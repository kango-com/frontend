<script setup lang="ts">
const open = defineModel<boolean>({ default: false })

defineProps<{
  title: string
}>()

const id = useId()
</script>

<template>
  <div class="kacc" :class="{ 'kacc--open': open }">
    <button
      type="button"
      class="kacc__head"
      :aria-expanded="open"
      :id="`${id}-head`"
      :aria-controls="`${id}-panel`"
      @click="open = !open"
    >
      <span class="kacc__title">{{ title }}</span>
      <Icon name="kango:plus-24" size="24" class="kacc__icon" />
    </button>
    <div v-show="open" :id="`${id}-panel`" class="kacc__panel" role="region" :aria-labelledby="`${id}-head`">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.kacc { width: 100%; }
.kacc__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  min-height: 44px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--color-label-primary);
  font-family: inherit;
  font-size: var(--text-16-16);
  line-height: var(--leading-16-16);
  text-align: left;
  cursor: pointer;
}
.kacc__head:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; border-radius: var(--radius-sm); }
.kacc__icon { flex: none; color: var(--color-fill-gray); transition: transform 0.3s ease-out; }
.kacc--open .kacc__icon { transform: rotate(45deg); }
.kacc__panel {
  padding-bottom: 12px;
  color: var(--color-label-secondary);
  font-size: var(--text-14-16);
  line-height: 20px;
}
</style>
