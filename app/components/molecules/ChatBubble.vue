<script setup lang="ts">
/** Сообщение в диалоге: своё справа (оранжевое), собеседника слева; время, «прочитано», ошибка отправки, жалоба */
defineProps<{
  text: string
  time: string
  mine?: boolean
  read?: boolean
  state?: 'sending' | 'failed'
  /** Показать действие «Пожаловаться» (для сообщений собеседника) */
  reportable?: boolean
}>()
const emit = defineEmits<{ retry: [], discard: [], report: [] }>()
</script>

<template>
  <div class="cbub" :class="{ 'cbub--mine': mine, 'cbub--failed': state === 'failed' }">
    <div class="cbub__bubble">
      <p class="cbub__text">{{ text }}</p>
      <span class="cbub__meta">
        {{ time }}
        <span v-if="mine && !state" class="cbub__ticks" role="img" :aria-label="read ? tr('Прочитано') : tr('Доставлено')">
          <Icon name="kango:check-16" size="14" />
          <Icon v-if="read" name="kango:check-16" size="14" class="cbub__tick2" />
        </span>
        <span v-else-if="state === 'sending'">{{ tr('Отправка...') }}</span>
      </span>
    </div>
    <div v-if="state === 'failed'" class="cbub__fail" role="alert">
      {{ tr('Не отправлено.') }}
      <button type="button" class="cbub__act" @click="emit('retry')">{{ tr('Повторить') }}</button>
      <button type="button" class="cbub__act" @click="emit('discard')">{{ tr('Удалить') }}</button>
    </div>
    <button v-if="reportable" type="button" class="cbub__report" @click="emit('report')">{{ tr('Пожаловаться') }}</button>
  </div>
</template>

<style scoped>
.cbub { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; max-width: min(78%, 560px); }
.cbub--mine { align-self: flex-end; align-items: flex-end; }
.cbub__bubble { padding: 8px 12px 6px; border-radius: 16px; border-end-start-radius: 4px; background: var(--color-fill-gray-3); }
.cbub--mine .cbub__bubble { border-end-start-radius: 16px; border-end-end-radius: 4px; background: var(--color-fill-primary); color: var(--color-label-white); }
.cbub--failed .cbub__bubble { opacity: 0.6; }
.cbub__text { margin: 0; font-size: var(--text-15-16); line-height: 20px; white-space: pre-wrap; overflow-wrap: anywhere; }
.cbub__meta { display: flex; align-items: center; justify-content: flex-end; gap: 4px; margin-top: 2px; color: var(--color-label-gray); font-size: 11px; line-height: 14px; }
.cbub--mine .cbub__meta { color: color-mix(in srgb, var(--color-label-white) 80%, transparent); }
.cbub__ticks { position: relative; display: inline-flex; width: 18px; height: 14px; }
.cbub__tick2 { position: absolute; inset-inline-start: 5px; }
.cbub__fail { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; color: var(--color-fill-error); font-size: var(--text-12-16); }
.cbub__act, .cbub__report { padding: 2px 0; border: 0; background: none; color: var(--color-fill-color-3); font-family: inherit; font-size: var(--text-12-16); cursor: pointer; }
.cbub__act:focus-visible, .cbub__report:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; border-radius: 2px; }
/* «Пожаловаться» появляется при наведении или фокусе, на сенсорных экранах видна всегда */
.cbub__report { color: var(--color-label-gray); }
@media (hover: hover) {
  .cbub__report { opacity: 0; transition: opacity 0.15s ease-out; }
  .cbub:hover .cbub__report, .cbub__report:focus-visible { opacity: 1; }
}
</style>
