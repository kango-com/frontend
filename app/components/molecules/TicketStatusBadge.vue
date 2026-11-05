<script setup lang="ts">
import type { TicketStatus } from '~/types'
import { TICKET_STATUS } from '~/utils/ticket'

/** Статус обращения: цветная плашка с текстом (цвет не единственный признак) */
const props = defineProps<{ status: TicketStatus }>()
const s = computed(() => TICKET_STATUS[props.status])
</script>

<template>
  <span class="tsb" :class="`tsb--${s.tone}`">{{ tr(s.label) }}</span>
</template>

<style scoped>
.tsb { display: inline-flex; align-items: center; flex: none; height: 24px; padding: 0 10px; border-radius: var(--radius-pill); background: var(--color-fill-gray-3); color: var(--color-label-primary); font-size: var(--text-13-16); line-height: 16px; white-space: nowrap; }
.tsb--new { background: color-mix(in srgb, var(--color-fill-color-3) 14%, transparent); color: var(--color-fill-color-3); }
.tsb--work { background: color-mix(in srgb, var(--color-fill-primary) 12%, transparent); color: var(--color-fill-primary); }
.tsb--wait { background: color-mix(in srgb, var(--color-fill-error) 12%, transparent); color: var(--color-fill-error); font-weight: var(--font-weight-medium); }
.tsb--done { background: color-mix(in srgb, #1a9d4d 14%, transparent); color: #137a3b; }
.tsb--closed { color: var(--color-label-secondary); }
</style>
