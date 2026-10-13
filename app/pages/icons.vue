<script setup lang="ts">
useHead({ title: 'Иконки - Kango' })

const files = Object.keys(import.meta.glob('../assets/icons/*.svg', { query: '?raw', import: 'default' }))

const names = files.map(f => f.split('/').pop()!.replace('.svg', '')).sort()

const sizeOf = (name: string) => name.match(/-(\d+)$/)?.[1] ?? 'social'

const groups = computed(() => {
  const order = ['12', '16', '20', '24', '32', 'social']
  return order
    .map(size => ({ size, items: names.filter(n => sizeOf(n) === size) }))
    .filter(g => g.items.length)
})

const copied = ref('')
async function copy(name: string) {
  try {
    await navigator.clipboard.writeText(`<Icon name="kango:${name}" />`)
    copied.value = name
    setTimeout(() => { if (copied.value === name) copied.value = '' }, 1500)
  } catch {
    copied.value = ''
  }
}
</script>

<template>
  <main class="page">
    <h1>Иконки</h1>
    <p class="hint">Клик по иконке копирует код для вставки. Всего: {{ names.length }}.</p>

    <section v-for="g in groups" :key="g.size">
      <h2>{{ g.size === 'social' ? 'Соцсети' : `${g.size}px` }}</h2>
      <ul class="grid">
        <li v-for="name in g.items" :key="name">
          <button type="button" class="cell" @click="copy(name)">
            <Icon :name="`kango:${name}`" class="icon" :size="g.size === 'social' ? 44 : Number(g.size)" />
            <span class="label">{{ copied === name ? 'Скопировано' : name }}</span>
          </button>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 16px;
  font-family: system-ui, sans-serif;
  color: #6c6c6c;
}
h1 { margin: 0 0 4px; color: #222; }
h2 { margin: 32px 0 12px; color: #222; font-size: 18px; }
.hint { margin: 0; }
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 16px 8px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  background: #fff;
  color: inherit;
  cursor: pointer;
}
.cell:hover { border-color: #fd4a00; color: #fd4a00; }
.icon { flex: none; }
.label { font-size: 12px; text-align: center; word-break: break-all; }
</style>
