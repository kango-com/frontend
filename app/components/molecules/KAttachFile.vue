<script setup lang="ts">
export interface AttachedFile {
  id: string
  /** URL превью (blob или адрес картинки) */
  url: string
  name?: string
}

const props = withDefaults(defineProps<{
  files?: AttachedFile[]
  label?: string
  accept?: string
  multiple?: boolean
  disabled?: boolean
  /** Максимум файлов: при достижении кнопка добавления отключается, удаление остаётся доступным */
  max?: number
}>(), { files: () => [], accept: 'image/*', multiple: true })

const emit = defineEmits<{
  add: [files: File[]]
  remove: [id: string]
}>()

const input = ref<HTMLInputElement>()

function onChange(e: Event) {
  const target = e.target as HTMLInputElement
  const picked = Array.from(target.files ?? [])
  if (picked.length) emit('add', picked)
  target.value = ''
}
</script>

<template>
  <div class="kaf" :class="{ 'kaf--filled': props.files.length }">
    <input ref="input" class="kaf__input" type="file" :accept="accept" :multiple="multiple" :disabled="disabled" tabindex="-1" @change="onChange">
    <ul class="kaf__list">
      <li v-for="f in props.files" :key="f.id" class="kaf__tile">
        <img class="kaf__img" :src="f.url" :alt="f.name ?? ''">
        <KIconButton class="kaf__remove" type="cancel" :disabled="disabled" :label="tr('Удалить {name}', { name: f.name ?? tr('фото') })" @click="emit('remove', f.id)" />
      </li>
      <li>
        <button type="button" class="kaf__add" :disabled="disabled || (max !== undefined && props.files.length >= max)" :aria-label="tr(label ?? 'Добавить фото')" @click="input?.click()">
          <Icon name="kango:plus-32" size="32" />
        </button>
      </li>
    </ul>
    <span v-if="!props.files.length" class="kaf__label">{{ tr(label ?? 'Добавить фото') }}</span>
  </div>
</template>

<style scoped>
.kaf {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 32px 16px;
  border: var(--border-width) solid var(--color-stroke-gray);
  border-radius: var(--radius-md);
  background: var(--color-background);
}
.kaf--filled { align-items: flex-start; padding: 16px; }
/* В состоянии Attach плитки 72x72, в пустом - плитка добавления 44x44 */
.kaf--filled .kaf__add { width: 72px; height: 72px; }
.kaf__input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.kaf__list { display: flex; flex-wrap: wrap; gap: 8px; margin: 0; padding: 0; list-style: none; }
.kaf__tile { position: relative; width: 72px; height: 72px; }
.kaf__img { width: 100%; height: 100%; border-radius: var(--radius-md); object-fit: cover; }
.kaf .kaf__remove { position: absolute; top: 4px; right: 4px; }
.kaf__add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: var(--border-width) solid var(--color-stroke-primary);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-fill-gray);
  cursor: pointer;
}
.kaf__add:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; }
.kaf__add:disabled { cursor: not-allowed; opacity: 0.5; }
.kaf__label { font-size: var(--text-16-16); line-height: var(--leading-16-16); color: var(--color-label-primary); }
</style>
