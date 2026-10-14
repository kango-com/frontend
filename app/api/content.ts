import type { DocumentFull, DocumentInfo, FeedbackPayload } from '~/types'
import { apiFetch } from './client'

export const contentApi = {
  documents: () => apiFetch<DocumentInfo[]>('/documents'),
  document: (slug: string) => apiFetch<DocumentFull>(`/documents/${slug}`),
  feedback: (payload: FeedbackPayload) => {
    const body = new FormData()
    body.set('name', payload.name)
    body.set('email', payload.email)
    if (payload.phone) body.set('phone', payload.phone)
    body.set('message', payload.message)
    if (payload.attachment) body.set('attachment', payload.attachment)
    return apiFetch<void>('/feedback', { method: 'POST', body })
  },
  upload: (file: File) => {
    const body = new FormData()
    body.set('file', file)
    return apiFetch<{ url: string }>('/uploads', { method: 'POST', body })
  }
}
