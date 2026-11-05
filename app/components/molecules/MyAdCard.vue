<script setup lang="ts">
import type { AdStatus } from '~/types'

/** Объявление в кабинете автора: статус, сроки, просмотры и действия, доступные в этом статусе (ТЗ п. 5, 7.1) */
const props = withDefaults(defineProps<{
  title: string
  price: string
  location: string
  image?: string
  to: string
  status?: AdStatus
  /** «Сегодня, 10:38» */
  published?: string
  views?: number
  /** Отформатированные даты: «до 12 ноя» */
  activeUntil?: string
  promotedUntil?: string
  highlightedUntil?: string
  /** Причина отклонения (status = rejected) */
  rejectReason?: string
  /** Действие выполняется: кнопки заблокированы */
  busy?: boolean
}>(), { status: 'active' })

const emit = defineEmits<{ edit: [], hide: [], republish: [], promote: [], remove: [] }>()

const STATUS_LABEL: Record<AdStatus, string> = {
  active: 'Активно',
  moderation: 'На модерации',
  rejected: 'Отклонено',
  hidden: 'Снято с публикации',
  deleted: 'Удалено'
}
const can = computed(() => ({
  promote: props.status === 'active',
  hide: props.status === 'active',
  republish: props.status === 'hidden',
  edit: props.status !== 'deleted',
  fix: props.status === 'rejected'
}))
</script>

<template>
  <article class="myad" :class="`myad--${status}`">
    <NuxtLink :to="to" class="myad__main">
      <img v-if="image" class="myad__img" :src="image" alt="">
      <span v-else class="myad__img myad__img--empty" aria-hidden="true" />
      <span class="myad__text">
        <span class="myad__status">{{ tr(STATUS_LABEL[status]) }}</span>
        <span class="myad__title">{{ title }}</span>
        <span class="myad__price">{{ price }}</span>
        <span class="myad__meta">{{ trl(location) }}<template v-if="published"> · {{ published }}</template></span>
      </span>
    </NuxtLink>

    <p v-if="status === 'rejected' && rejectReason" class="myad__reason">
      <span class="myad__reason-title">{{ tr('Причина отклонения') }}</span>
      {{ rejectReason }}
    </p>
    <p v-else-if="status === 'moderation'" class="myad__hint">{{ tr('Проверка обычно занимает до часа. Мы пришлём уведомление.') }}</p>

    <ul v-if="status === 'active' || status === 'hidden'" class="myad__facts">
      <li v-if="views !== undefined"><Icon name="kango:eye-24" size="16" />{{ tr('{n} просмотров', { n: views }) }}</li>
      <li v-if="activeUntil">{{ tr('Активно до {date}', { date: activeUntil }) }}</li>
      <li v-if="promotedUntil" class="myad__fact--paid">{{ tr('Поднято до {date}', { date: promotedUntil }) }}</li>
      <li v-if="highlightedUntil" class="myad__fact--paid">{{ tr('Выделено до {date}', { date: highlightedUntil }) }}</li>
    </ul>

    <div class="myad__actions">
      <KButton v-if="can.fix" size="sm" :disabled="busy" @click="emit('edit')">{{ tr('Исправить') }}</KButton>
      <KButton v-if="can.promote" size="sm" variant="outline" :disabled="busy" @click="emit('promote')">{{ tr('Продвинуть') }}</KButton>
      <KButton v-if="can.republish" size="sm" variant="outline" :disabled="busy" @click="emit('republish')">{{ tr('Опубликовать снова') }}</KButton>
      <KTextButton v-if="can.edit && !can.fix" size="sm" :disabled="busy" @click="emit('edit')">{{ tr('Редактировать') }}</KTextButton>
      <KTextButton v-if="can.hide" size="sm" :disabled="busy" @click="emit('hide')">{{ tr('Снять') }}</KTextButton>
      <KTextButton size="sm" class="myad__remove" :disabled="busy" @click="emit('remove')">{{ tr('Удалить') }}</KTextButton>
    </div>
  </article>
</template>

<style scoped>
.myad { display: flex; flex-direction: column; gap: 12px; height: 100%; padding: 12px; border: var(--border-width) solid var(--color-stroke-gray); border-radius: var(--radius-md); background: var(--color-background); }
.myad .myad__main { display: flex; gap: 12px; color: inherit; text-decoration: none; }
.myad .myad__main:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; border-radius: var(--radius-md); }
.myad__img { flex: none; width: 88px; height: 88px; border-radius: var(--radius-md); object-fit: cover; background: var(--color-fill-gray-3); }
.myad--hidden .myad__img { opacity: 0.5; }
.myad__text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.myad__status { align-self: flex-start; margin-bottom: 4px; padding: 2px 8px; border-radius: var(--radius-pill); font-size: var(--text-12-16); line-height: var(--leading-12-16); font-weight: var(--font-weight-medium); }
.myad--active .myad__status { background: var(--color-fill-tint); color: var(--color-fill-color-3); }
.myad--moderation .myad__status { background: color-mix(in srgb, var(--color-fill-primary) 10%, transparent); color: var(--color-fill-color-4); }
.myad--rejected .myad__status { background: color-mix(in srgb, var(--color-fill-error) 10%, transparent); color: var(--color-fill-error); }
.myad--hidden .myad__status { background: var(--color-fill-gray-3); color: var(--color-label-secondary); }
.myad__title { font-size: var(--text-16-20); line-height: var(--leading-16-20); font-weight: var(--font-weight-medium); overflow-wrap: anywhere; }
.myad__price { font-size: var(--text-15-16); font-weight: var(--font-weight-medium); }
.myad__meta { color: var(--color-label-gray); font-size: var(--text-12-16); line-height: var(--leading-12-16); }
.myad__reason { display: flex; flex-direction: column; gap: 2px; margin: 0; padding: 10px 12px; border-radius: var(--radius-sm); background: color-mix(in srgb, var(--color-fill-error) 6%, transparent); font-size: var(--text-14-16); line-height: 20px; }
.myad__reason-title { color: var(--color-fill-error); font-size: var(--text-12-16); font-weight: var(--font-weight-medium); }
.myad__hint { margin: 0; color: var(--color-label-secondary); font-size: var(--text-14-16); line-height: 20px; }
.myad__facts { display: flex; flex-wrap: wrap; gap: 4px 12px; margin: 0; padding: 0; list-style: none; color: var(--color-label-secondary); font-size: var(--text-13-16); line-height: var(--leading-13-16); }
.myad__facts li { display: inline-flex; align-items: center; gap: 4px; }
.myad__fact--paid { color: var(--color-fill-color-4); font-weight: var(--font-weight-medium); }
.myad__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; margin-top: auto; padding-top: 4px; }
.myad .myad__remove { margin-inline-start: auto; color: var(--color-fill-error); }
</style>
