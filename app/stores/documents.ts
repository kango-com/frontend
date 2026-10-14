import { defineStore } from 'pinia'
import { contentApi } from '~/api'
import type { DocumentFull, DocumentInfo, LoadStatus } from '~/types'

export const useDocumentsStore = defineStore('documents', () => {
  const list = ref<DocumentInfo[]>([])
  const current = ref<DocumentFull | null>(null)
  const status = ref<LoadStatus>('idle')
  /** Реквизиты для раскрывающегося блока футера (отдельно от открытого документа) */
  const requisites = ref<DocumentFull | null>(null)
  /** Статус списка отдельно от статуса открытого документа */
  const listStatus = ref<LoadStatus>('idle')

  const documents = computed(() => list.value.filter(d => d.group === 'documents'))
  const details = computed(() => list.value.filter(d => d.group === 'details'))

  async function load() {
    if (list.value.length) return
    listStatus.value = 'loading'
    try {
      list.value = await contentApi.documents()
      listStatus.value = 'success'
    } catch {
      listStatus.value = 'error'
    }
  }

  async function open(slug: string) {
    status.value = 'loading'
    try {
      current.value = await contentApi.document(slug)
      status.value = 'success'
    } catch {
      current.value = null
      status.value = 'error'
    }
  }

  async function loadRequisites() {
    if (requisites.value) return
    const info = list.value.find(d => d.group === 'details')
    if (!info) return
    try { requisites.value = await contentApi.document(info.slug) } catch { /* футер покажет ссылку */ }
  }

  return { requisites, loadRequisites, list, documents, details, current, status, listStatus, load, open }
})
