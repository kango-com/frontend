import { defineStore } from 'pinia'
import { geoApi } from '~/api'
import type { LoadStatus, SectionInfo } from '~/types'

export const useSectionsStore = defineStore('sections', () => {
  const items = ref<SectionInfo[]>([])
  const status = ref<LoadStatus>('idle')

  async function load(cityIds: string[] = []) {
    status.value = 'loading'
    try {
      items.value = await geoApi.sections(cityIds)
      status.value = 'success'
    } catch {
      status.value = 'error'
    }
  }

  const byId = (id: SectionInfo['id']) => items.value.find(s => s.id === id)
  return { items, status, load, byId }
})
