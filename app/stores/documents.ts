import { defineStore } from 'pinia'
import { contentApi } from '~/api'
import type { DocumentFull, DocumentInfo, LoadStatus } from '~/types'

export const useDocumentsStore = defineStore('documents', () => {
  const list = ref<DocumentInfo[]>([])
  const current = ref<DocumentFull | null>(null)
  const status = ref<LoadStatus>('idle')
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

  return { list, documents, details, current, status, listStatus, load, open }
})
