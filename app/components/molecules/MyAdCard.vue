<script setup lang="ts">
defineProps<{
  title: string
  price: string
  location: string
  image?: string
  to: string
  published?: string
  /** Платное продвижение уже подключено */
  promoted?: boolean
}>()

defineEmits<{ promote: [], remove: [] }>()
</script>

<template>
  <article class="myad">
    <NuxtLink :to="to" class="myad__main">
      <img v-if="image" class="myad__img" :src="image" alt="">
      <span v-else class="myad__img myad__img--empty" aria-hidden="true" />
      <span class="myad__text">
        <span class="myad__title">{{ title }}</span>
        <span class="myad__price">{{ price }}</span>
        <span class="myad__meta">{{ location }}<template v-if="published"> · {{ published }}</template></span>
        <span v-if="promoted" class="myad__badge">Продвигается</span>
      </span>
    </NuxtLink>
    <div class="myad__actions">
      <KButton size="sm" variant="outline" @click="$emit('promote')">Продвинуть</KButton>
      <KTextButton size="sm" @click="$emit('remove')">Удалить</KTextButton>
    </div>
  </article>
</template>

<style scoped>
.myad { display: flex; flex-direction: column; gap: 8px; padding: 12px; border: var(--border-width) solid var(--color-stroke-gray); border-radius: var(--radius-md); background: var(--color-background); }
.myad .myad__main { display: flex; gap: 12px; color: inherit; text-decoration: none; }
.myad .myad__main:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; border-radius: var(--radius-md); }
.myad__img { flex: none; width: 88px; height: 88px; border-radius: var(--radius-md); object-fit: cover; background: var(--color-fill-gray-3); }
.myad__text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.myad__title { font-size: var(--text-16-20); line-height: var(--leading-16-20); font-weight: var(--font-weight-medium); overflow-wrap: anywhere; }
.myad__price { font-size: var(--text-15-16); font-weight: var(--font-weight-medium); }
.myad__meta { color: var(--color-label-gray); font-size: var(--text-12-16); line-height: var(--leading-12-16); }
.myad__badge { align-self: flex-start; margin-top: 2px; padding: 2px 8px; border-radius: var(--radius-pill); background: var(--color-fill-tint); color: var(--color-fill-color-4); font-size: var(--text-12-12); }
.myad__actions { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
</style>
