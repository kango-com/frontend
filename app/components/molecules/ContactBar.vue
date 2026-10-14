<script setup lang="ts">
import { contactLinks } from '~/utils/ad-view'

const props = defineProps<{
  phone?: string
  telegram?: string
  whatsapp?: string
}>()

const links = computed(() => contactLinks(props))
</script>

<template>
  <div v-if="links.length" class="cbar" role="group" :aria-label="tr('Связаться с автором')">
    <KButton
      v-for="l in links"
      :key="l.kind"
      class="cbar__btn"
      :variant="l.kind === 'phone' ? 'primary' : 'outline'"
      :href="l.href"
      :target="l.kind === 'phone' ? undefined : '_blank'"
      rel="noopener"
    >{{ tr(l.label) }}</KButton>
  </div>
  <p v-else class="cbar__none">{{ tr('Автор не оставил контактов.') }}</p>
</template>

<style scoped>
.cbar { display: flex; flex-wrap: wrap; gap: 8px; }
.cbar .cbar__btn { flex: 1 1 0; min-width: 100px; }
.cbar__none { margin: 0; color: var(--color-label-secondary); font-size: var(--text-14-16); }
</style>
