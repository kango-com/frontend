<script setup lang="ts">
/** Аватар пользователя: фото или первая буква имени на оранжевом круге */
const props = withDefaults(defineProps<{ name?: string, src?: string, size?: number }>(), { size: 64 })
const initial = computed(() => props.name?.trim().charAt(0).toUpperCase() || '?')
</script>

<template>
  <span class="uav" :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.44)}px` }" aria-hidden="true">
    <img v-if="src" :src="src" alt="" class="uav__img">
    <template v-else>{{ initial }}</template>
  </span>
</template>

<style scoped>
.uav { display: inline-flex; flex: none; align-items: center; justify-content: center; overflow: hidden; border-radius: 50%; background: var(--color-fill-primary); color: var(--color-label-white); font-weight: var(--font-weight-medium); line-height: 1; }
.uav__img { width: 100%; height: 100%; object-fit: cover; }
</style>
