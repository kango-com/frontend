import { http } from 'msw'
import { documents } from '../fixtures/content'
import { fail, json, noContent, notFound, simulate } from '../utils'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const contentHandlers = (base: string) => [
  http.get(`${base}/documents`, async () => {
    const err = await simulate(); if (err) return err
    return json(documents.map(({ slug, title, group }) => ({ slug, title, group })))
  }),

  http.get(`${base}/documents/:slug`, async ({ params }) => {
    const err = await simulate(); if (err) return err
    const doc = documents.find(d => d.slug === params.slug)
    return doc ? json(doc) : notFound('Документ')
  }),

  http.post(`${base}/feedback`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const form = await request.formData()
    const fields: Record<string, string> = {}
    if (!String(form.get('name') ?? '').trim()) fields.name = 'Заполните поля'
    if (!EMAIL.test(String(form.get('email') ?? ''))) fields.email = 'Введите корректный e-mail'
    if (!String(form.get('message') ?? '').trim()) fields.message = 'Заполните поля'
    if (Object.keys(fields).length) return fail(422, 'validation', 'Проверьте поля формы', fields)
    return noContent()
  }),

  http.post(`${base}/uploads`, async ({ request }) => {
    const err = await simulate(); if (err) return err
    const file = (await request.formData()).get('file')
    if (!(file instanceof File)) return fail(422, 'validation', 'Файл не передан', { file: 'Файл не передан' })
    const buffer = new Uint8Array(await file.arrayBuffer())
    let binary = ''
    buffer.forEach(b => { binary += String.fromCharCode(b) })
    return json({ url: `data:${file.type || 'application/octet-stream'};base64,${btoa(binary)}` }, 201)
  })
]
