<script setup lang="ts">
import type { LoadStatus } from '~/types'

export interface PickerItem {
  id: string
  title: string
}

const props = defineProps<{
  items: PickerItem[]
  /** Выбранные id (v-model); пусто - выбрано значение по умолчанию. Кнопку «Применить» показывает родитель */
  modelValue: string[]
  multiple?: boolean
  /** Подпись значения по умолчанию («Любая», «Весь Израиль»), строка сверху */
  anyLabel?: string
  searchPlaceholder: string
  status?: LoadStatus
  /** Поиск выполняет родитель (сервер): список не фильтруется локально */
  remote?: boolean
}>()

const emit = defineEmits<{ 'update:modelValue': [ids: string[]], 'search': [query: string] }>()

const query = ref('')
const picked = computed(() => props.modelValue)

watch(query, q => { if (props.remote) emit('search', q.trim()) })

const shown = computed(() => {
  const q = query.value.trim().toLowerCase()
  return props.remote || !q ? props.items : props.items.filter(i => tr(i.title).toLowerCase().includes(q))
})

function toggle(id: string) {
  if (!props.multiple) { emit('update:modelValue', [id]); return }
  emit('update:modelValue', picked.value.includes(id) ? picked.value.filter(x => x !== id) : [...picked.value, id])
}
const chooseAny = () => emit('update:modelValue', [])
</script>

<template>
  <div class="pick">
    <KSearchField v-model="query" :placeholder="searchPlaceholder" :label="searchPlaceholder" />

    <div class="pick__list" :aria-busy="status === 'loading'">
      <KTableRow v-if="anyLabel && !query" :type="multiple ? 'checkbox' : 'select'" :label="anyLabel" :model-value="!picked.length" :selected="!picked.length" @update:model-value="chooseAny" @click="chooseAny" />
      <KTableRow
        v-for="i in shown"
        :key="i.id"
        :type="multiple ? 'checkbox' : 'select'"
        :label="i.title"
        :model-value="picked.includes(i.id)"
        :selected="picked.includes(i.id)"
        @update:model-value="toggle(i.id)"
        @click="toggle(i.id)"
      />
      <p v-if="status === 'loading' && !items.length" class="pick__note">{{ tr('Загрузка...') }}</p>
      <p v-else-if="status === 'error'" class="pick__note" role="alert">{{ tr('Не удалось загрузить список.') }}</p>
      <p v-else-if="!shown.length" class="pick__note">{{ tr('Ничего не найдено. Проверьте запрос.') }}</p>
    </div>
  </div>
</template>

<style scoped>
.pick { display: flex; flex-direction: column; gap: 12px; }
.pick__list { display: flex; flex-direction: column; }
.pick__note { margin: 0; padding: 24px 0; color: var(--color-label-secondary); font-size: var(--text-16-20); line-height: var(--leading-16-20); text-align: center; }
</style>
