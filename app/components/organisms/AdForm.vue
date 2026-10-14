<script setup lang="ts">
import { geoApi } from '~/api'
import type { AttachedFile } from '~/components/molecules/KAttachFile.vue'
import { PRICE_LABELS, PRICE_PERIODS, PUBLISH_BLOCKS, setPath } from '~/utils/publish-schema'

/** Форма подачи объявления для выбранного раздела: поля из схемы + общие (название, описание, цена, адрес, фото, контакты) */
const emit = defineEmits<{ published: [], back: [] }>()

const draftStore = useDraftAdStore()
const city = useCityStore()

const draft = computed(() => draftStore.draft)
const section = computed(() => draft.value.section!)
const params = computed(() => (draft.value.params ?? {}) as Record<string, unknown>)
const errors = computed(() => draftStore.errors)
const busy = computed(() => draftStore.status === 'loading')
const generating = ref(false)
const uploading = ref(false)

const blocks = computed(() => PUBLISH_BLOCKS[section.value])
const visible = (f: { visible?: (p: Record<string, unknown>) => boolean }) => !f.visible || f.visible(params.value)

onMounted(() => city.search(''))
const cityOptions = computed(() => city.results.map(c => ({ value: c.name, label: c.name })))

// Подсказки улиц выбранного города
const streets = ref<string[]>([])
watch(() => draft.value.city, async (name) => {
  const found = city.results.find(c => c.name === name)
  if (!found) { streets.value = []; return }
  try { streets.value = (await geoApi.streets([found.id], [])).map(s => s.title) } catch { streets.value = [] }
}, { immediate: true })

function change(key: string, value: unknown, resets?: string[]) {
  let next = setPath(params.value, key, value)
  for (const k of resets ?? []) next = setPath(next, k, undefined)
  draftStore.patch({ params: next } as never)
}

const price = computed(() => draft.value.price?.amount ? String(draft.value.price.amount) : '')
const period = computed(() => draft.value.price?.period ?? '')
function setPrice(v: string) {
  draftStore.patch({ price: { currency: 'ILS', ...draft.value.price, amount: Number(v) || 0 } } as never)
}
function setPeriod(v: string) {
  draftStore.patch({ price: { currency: 'ILS', amount: 0, ...draft.value.price, period: v } } as never)
}

const files = computed<AttachedFile[]>(() => (draft.value.images ?? []).map((url, i) => ({ id: url, url, name: `Фото ${i + 1}` })))
async function addFiles(list: File[]) {
  uploading.value = true
  try {
    for (const f of list.slice(0, 10 - files.value.length)) await draftStore.uploadImage(f)
  } finally {
    uploading.value = false
  }
}
const removeFile = (id: string) => draftStore.patch({ images: (draft.value.images ?? []).filter(u => u !== id) })

async function generate() {
  generating.value = true
  try { await draftStore.generateDescription() } finally { generating.value = false }
}

const setContact = (key: 'phone' | 'whatsapp' | 'telegram', v: string) =>
  draftStore.patch({ contacts: { ...draft.value.contacts, [key]: v || undefined } })

async function submit() {
  if (await draftStore.publish()) emit('published')
}
</script>

<template>
  <form class="adf" novalidate @submit.prevent="submit">
    <header class="adf__head">
      <KIconButton type="arrow-left" label="Назад к выбору раздела" @click="emit('back')" />
      <h1 class="adf__title">Новое объявление</h1>
    </header>

    <FormSection v-for="b in blocks" :key="b.title" :title="b.title">
      <template v-for="f in b.fields" :key="f.key">
        <PublishField v-if="visible(f)" :field="f" :params="params" :error="errors[f.key]" @change="change" />
      </template>
    </FormSection>

    <FormSection title="Основное">
      <KTextField :model-value="draft.title ?? ''" placeholder="Назовите объявление" label="Название объявления" :error="errors.title" @update:model-value="draftStore.patch({ title: $event })" />
      <DescriptionField :model-value="draft.description ?? ''" :error="errors.description" :generating="generating" @update:model-value="draftStore.patch({ description: $event })" @generate="generate" />
      <div class="adf__price">
        <KTextField type="number" inputmode="numeric" :placeholder="`${PRICE_LABELS[section]}, ₪`" :label="PRICE_LABELS[section]" :model-value="price" :error="errors.price" @update:model-value="setPrice" />
        <KSegmentControl v-if="(PRICE_PERIODS[section]?.length ?? 0) > 1" :model-value="period" :options="PRICE_PERIODS[section]!" label="Период" @update:model-value="setPeriod" />
      </div>
    </FormSection>

    <FormSection title="Где">
      <KSelect :model-value="draft.city ?? ''" :options="cityOptions" placeholder="Город" label="Город" :error="!!errors.city" @update:model-value="draftStore.patch({ city: $event, address: '' })" />
      <p v-if="errors.city" class="adf__error" role="alert">{{ errors.city }}</p>
      <AddressField :model-value="draft.address ?? ''" :suggestions="streets" @update:model-value="draftStore.patch({ address: $event })" />
    </FormSection>

    <FormSection title="Фото">
      <KAttachFile :files="files" :disabled="uploading || files.length >= 10" @add="addFiles" @remove="removeFile" />
    </FormSection>

    <FormSection title="Контакты">
      <KTextField type="tel" placeholder="Телефон" label="Телефон" autocomplete="tel" :model-value="draft.contacts?.phone ?? ''" :error="errors.phone" @update:model-value="setContact('phone', $event)" />
      <KTextField type="tel" placeholder="WhatsApp" label="WhatsApp" :model-value="draft.contacts?.whatsapp ?? ''" @update:model-value="setContact('whatsapp', $event)" />
      <KTextField placeholder="Telegram (@username)" label="Telegram" :model-value="draft.contacts?.telegram ?? ''" @update:model-value="setContact('telegram', $event)" />
    </FormSection>

    <p v-if="draftStore.error && !Object.keys(errors).length" class="adf__error" role="alert">{{ draftStore.error.message }}</p>
    <p v-if="Object.keys(errors).length" class="adf__error" role="alert">Проверьте поля формы: {{ Object.keys(errors).length }} требуют внимания.</p>
    <KButton block type="submit" :disabled="busy || uploading">{{ busy ? 'Публикуем...' : 'Опубликовать' }}</KButton>
  </form>
</template>

<style scoped>
.adf { display: flex; flex-direction: column; gap: 24px; width: 100%; max-width: 560px; margin-inline: auto; padding: 16px 16px 40px; }
.adf__head { display: flex; align-items: center; gap: 12px; }
.adf__title { margin: 0; font-size: var(--text-22-24); line-height: var(--leading-22-24); font-weight: var(--font-weight-medium); }
.adf__price { display: flex; flex-direction: column; gap: 8px; }
.adf__error { margin: 0; color: var(--color-fill-error); font-size: var(--text-14-16); line-height: var(--leading-14-16); }
</style>
