import type { AttachedFile } from '~/components/molecules/KAttachFile.vue'
import type { TicketAttachment } from '~/types'
import { TICKET_MAX_FILE_BYTES, TICKET_MAX_FILES } from '~/utils/ticket'

/** Вложения обращения: до 3 файлов по 2 МБ, превью, перевод в data-URL для мока (в боевой версии - загрузка на сервер) */
export function useTicketFiles() {
  const files = ref<{ id: string, file: File, url: string }[]>([])
  const error = ref('')
  const previews = computed<AttachedFile[]>(() => files.value.map(f => ({ id: f.id, url: f.url, name: f.file.name })))

  function add(picked: File[]) {
    error.value = ''
    for (const file of picked) {
      if (files.value.length >= TICKET_MAX_FILES) { error.value = tr('Не больше 3 файлов'); break }
      if (file.size > TICKET_MAX_FILE_BYTES) { error.value = tr('Файл больше 2 МБ'); continue }
      files.value.push({ id: `${file.name}-${file.size}-${files.value.length}`, file, url: URL.createObjectURL(file) })
    }
  }
  function remove(id: string) {
    const f = files.value.find(x => x.id === id)
    if (f) URL.revokeObjectURL(f.url)
    files.value = files.value.filter(x => x.id !== id)
    error.value = ''
  }
  function clear() {
    files.value.forEach(f => URL.revokeObjectURL(f.url))
    files.value = []
  }
  const read = (file: File) => new Promise<string>((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(r.error)
    r.readAsDataURL(file)
  })
  async function payload(): Promise<TicketAttachment[]> {
    return Promise.all(files.value.map(async f => ({ url: await read(f.file), name: f.file.name, size: f.file.size, type: f.file.type })))
  }
  onBeforeUnmount(clear)
  return { previews, error, count: computed(() => files.value.length), add, remove, clear, payload }
}
