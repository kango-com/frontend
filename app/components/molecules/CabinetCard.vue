<script setup lang="ts">
/** Карточка раздела страницы кабинета: заголовок, пояснение, статус сохранения справа, содержимое */
defineProps<{
  title: string
  description?: string
  /** Короткий статус у заголовка («Сохранено»), объявляется скринридеру */
  status?: string
}>()
const id = useId()
</script>

<template>
  <section class="ccard" :aria-labelledby="id">
    <header class="ccard__head">
      <div class="ccard__titles">
        <h2 :id="id" class="ccard__title">{{ title }}</h2>
        <p v-if="description" class="ccard__desc">{{ description }}</p>
      </div>
      <span class="ccard__status" role="status">
        <template v-if="status"><Icon name="kango:check-16" size="16" />{{ status }}</template>
      </span>
    </header>
    <div class="ccard__body"><slot /></div>
  </section>
</template>

<style scoped>
.ccard { display: flex; flex-direction: column; gap: 16px; padding: 20px 16px; border: var(--border-width) solid var(--color-stroke-gray); border-radius: var(--radius-md); background: var(--color-background); }
.ccard__head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.ccard__titles { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.ccard__title { margin: 0; font-size: var(--text-17-20); line-height: var(--leading-17-20); font-weight: var(--font-weight-medium); }
.ccard__desc { margin: 0; color: var(--color-label-secondary); font-size: var(--text-14-16); line-height: 20px; }
.ccard__status { display: inline-flex; flex: none; align-items: center; gap: 4px; min-height: 20px; color: var(--color-fill-color-3); font-size: var(--text-13-16); white-space: nowrap; }
.ccard__body { display: flex; flex-direction: column; gap: 16px; }
@media (min-width: 768px) {
  .ccard { padding: 24px; }
}
</style>
