<script setup lang="ts">
useHead({ title: 'Токены - Kango' })

const colors = [
  'fill-primary', 'stroke-primary', 'fill-color-4', 'fill-color', 'fill-color-3', 'stroke-color',
  'label-primary', 'label-secondary', 'label-gray', 'label-white',
  'background', 'fill-white', 'fill-gray', 'fill-gray-2', 'fill-gray-3', 'fill-gray-10',
  'stroke-gray', 'separator-gray'
]
const texts = ['28-28', '22-24', '20-20', '17-20', '16-16', '15-16', '14-16', '13-16', '12-12', '10-12']
const radii = ['sm', 'md']
</script>

<template>
  <main class="page">
    <h1>Токены</h1>
    <p class="hint">Источник: DESIGN.md. Значения лежат в app/assets/css/tokens.css.</p>

    <h2>Цвета</h2>
    <ul class="grid">
      <li v-for="c in colors" :key="c" class="cell">
        <span class="swatch" :style="{ background: `var(--color-${c})` }" />
        <span class="label">{{ c }}</span>
      </li>
    </ul>

    <h2>Типографика, Inter</h2>
    <ul class="list">
      <li v-for="t in texts" :key="t" :style="{ fontSize: `var(--text-${t})`, lineHeight: `var(--leading-${t})` }">
        <span class="mono">{{ t }}</span>
        Объявления для русскоязычных в Израиле
      </li>
    </ul>

    <h2>Радиусы</h2>
    <ul class="grid">
      <li v-for="r in radii" :key="r" class="cell">
        <span class="box" :style="{ borderRadius: `var(--radius-${r})` }" />
        <span class="label">radius-{{ r }}</span>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.page { max-width: 960px; margin: 0 auto; padding: 32px var(--spacing-gutter); color: var(--color-fill-gray); }
h1 { margin: 0 0 4px; color: var(--color-label-primary); font-size: var(--text-28-28); line-height: var(--leading-28-28); font-weight: var(--font-weight-medium); }
h2 { margin: 32px 0 12px; color: var(--color-label-primary); font-size: var(--text-20-20); line-height: var(--leading-20-20); font-weight: var(--font-weight-medium); }
.hint { margin: 0; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px; padding: 0; margin: 0; list-style: none; }
.cell { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 12px 8px; border: var(--border-width) solid var(--color-stroke-gray); border-radius: var(--radius-md); }
.swatch { width: 100%; height: 48px; border-radius: var(--radius-sm); border: var(--border-width) solid var(--color-stroke-gray); }
.box { width: 48px; height: 48px; border: var(--border-width-strong) solid var(--color-stroke-primary); }
.label { font-size: var(--text-12-12); line-height: var(--leading-12-12); text-align: center; word-break: break-all; }
.list { padding: 0; margin: 0; list-style: none; color: var(--color-label-primary); }
.list li { display: flex; gap: 16px; align-items: baseline; padding: 8px 0; border-bottom: var(--border-width) solid var(--color-separator-gray); }
.mono { flex: none; width: 56px; color: var(--color-label-secondary); font-size: var(--text-12-12); }
</style>
