export interface DocumentInfo {
  slug: string
  title: string
  group: 'documents' | 'details'
}

export interface DocumentSection {
  title: string
  text: string
}

export interface DocumentFull extends DocumentInfo {
  sections: DocumentSection[]
}

export interface FeedbackPayload {
  name: string
  email: string
  message: string
  attachment?: File | null
}
