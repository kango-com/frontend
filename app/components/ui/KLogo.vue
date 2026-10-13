<script setup lang="ts">
import logo from '~/assets/img/kango-logo.svg'
import logoWhite from '~/assets/img/kango-logo-white.svg'

const props = withDefaults(defineProps<{
  /** white - светлая надпись, для тёмного фона (оранжевая плитка остаётся) */
  variant?: 'color' | 'white'
  /** Высота в px, ширина считается по пропорциям 287:97 */
  height?: number
  to?: string
}>(), { variant: 'color', height: 32 })

const src = computed(() => (props.variant === 'white' ? logoWhite : logo))
const width = computed(() => Math.round((props.height * 287) / 97))
const tag = computed(() => (props.to ? resolveComponent('NuxtLink') : 'span'))
const attrs = computed(() => (props.to ? { 'to': props.to, 'aria-label': 'Kango, на главную' } : {}))
</script>

<template>
  <component :is="tag" v-bind="attrs" class="klogo">
    <img :src="src" :width="width" :height="height" alt="Kango">
  </component>
</template>

<style scoped>
.klogo { display: inline-flex; flex: none; line-height: 0; }
.klogo img { display: block; }
.klogo:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; border-radius: var(--radius-sm); }
</style>
