import { defineStore } from 'pinia'
import { adsApi, contentApi, isApiError, paymentsApi } from '~/api'
import type { Ad, AdDraft, ApiError, LoadStatus, PromoPackage, PromoPackageId, Section } from '~/types'
import { type DraftData, validateDraft } from '~/utils/draft'
import { defaultParams, PRICE_PERIODS } from '~/utils/publish-schema'

export type PublishStep = 'section' | 'form' | 'promote' | 'success'
const KEY = 'kango.draft'

export const useDraftAdStore = defineStore('draftAd', () => {
  const draft = ref<DraftData>({})
  const step = ref<PublishStep>('section')
  const errors = ref<Record<string, string>>({})
  const status = ref<LoadStatus>('idle')
  const error = ref<ApiError | null>(null)
  const createdId = ref<string | null>(null)
  const packages = ref<PromoPackage[]>([])
  const selectedPackage = ref<PromoPackageId | null>(null)
  /** Режим редактирования существующего объявления (из кабинета): черновик подачи не трогаем */
  const editingId = ref<string | null>(null)

  const persist = () => {
    if (editingId.value) return
    if (import.meta.client) try { localStorage.setItem(KEY, JSON.stringify({ draft: draft.value, step: step.value, createdId: createdId.value })) } catch { /* ignore */ }
  }

  /** Контакты из профиля подставляются в новое объявление (ТЗ п. 4.1: контакты по умолчанию) */
  function defaultContacts() {
    const u = useAuthStore().user
    if (!u?.phone) return {}
    return { phone: u.phone, whatsapp: u.whatsapp ? u.phone : undefined, telegram: u.telegram }
  }

  /** Загрузить своё объявление в форму для правки; возвращает, удалось ли */
  async function startEdit(id: string): Promise<boolean> {
    status.value = 'loading'
    error.value = null
    errors.value = {}
    try {
      const ad = await adsApi.byId(id)
      // в форму идут только поля черновика: служебные (номер, автор, даты) не отправляются обратно
      const { id: _id, number: _n, createdAt: _c, author: _a, isFavorite: _f, promoted: _p, highlighted: _h, ...rest } = ad as Ad & Record<string, unknown>
      for (const k of ['status', 'rejectReason', 'views', 'expiresAt', 'promotedUntil', 'highlightedUntil']) delete (rest as Record<string, unknown>)[k]
      editingId.value = id
      draft.value = rest as unknown as DraftData
      step.value = 'form'
      status.value = 'idle'
      return true
    } catch (e) {
      status.value = 'error'
      error.value = isApiError(e) ? e : { status: 0, code: 'unknown', message: tr('Что-то пошло не так') }
      return false
    }
  }

  /** Восстановить черновик, если пользователь не завершил подачу */
  function restore() {
    if (!import.meta.client) return
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) ?? 'null') as { draft?: DraftData, step?: PublishStep, createdId?: string | null } | null
      if (raw?.draft?.section) { draft.value = raw.draft; createdId.value = raw.createdId ?? null; step.value = raw.step === 'success' ? 'section' : raw.step ?? 'form' }
    } catch { /* ignore */ }
  }

  function chooseSection(section: Section) {
    if (draft.value.section !== section) {
      draft.value = {
        section,
        title: '',
        description: '',
        images: [],
        contacts: defaultContacts(),
        city: useCityStore().current.name,
        params: defaultParams(section),
        price: { amount: 0, currency: 'ILS', period: PRICE_PERIODS[section]?.[0]?.value }
      } as unknown as DraftData
    }
    errors.value = {}
    step.value = 'form'
    persist()
  }

  function patch(partial: Partial<DraftData>) {
    draft.value = { ...draft.value, ...partial } as DraftData
    persist()
  }

  /** Меняет поле раздела (`params`), например `setParam('hebrew', 'none')` */
  function setParam(key: string, value: unknown) {
    draft.value = { ...draft.value, params: { ...(draft.value.params as object), [key]: value } } as unknown as DraftData
    persist()
  }

  const validate = () => (errors.value = validateDraft(draft.value))

  function setStep(next: PublishStep) {
    step.value = next
    persist()
  }

  async function loadPackages() {
    if (packages.value.length) return
    try { packages.value = await paymentsApi.packages() } catch { /* экран продвижения покажет пустой список */ }
  }

  /** Публикация: валидация, создание объявления, переход к продвижению */
  async function publish(): Promise<boolean> {
    if (Object.keys(validate()).length) return false
    status.value = 'loading'
    error.value = null
    try {
      if (editingId.value) {
        await adsApi.update(editingId.value, draft.value as AdDraft)
        status.value = 'success'
        return true
      }
      const result = await adsApi.create(draft.value as AdDraft)
      createdId.value = result.id
      status.value = 'success'
      step.value = 'promote'
      persist()
      return true
    } catch (e) {
      status.value = 'error'
      error.value = isApiError(e) ? e : { status: 0, code: 'unknown', message: tr('Что-то пошло не так') }
      if (error.value.fields) errors.value = error.value.fields
      return false
    }
  }

  async function generateDescription() {
    if (!draft.value.section) return
    try {
      const { description } = await adsApi.describe(draft.value.section, { title: draft.value.title, ...(draft.value.params as object) })
      patch({ description })
    } catch { /* поле остаётся как есть */ }
  }

  async function uploadImage(file: File) {
    const { url } = await contentApi.upload(file)
    patch({ images: [...(draft.value.images ?? []), url] })
    return url
  }

  /** Создаёт платёж и возвращает адрес страницы оплаты */
  async function pay(returnUrl: string, adId: string | null = createdId.value): Promise<string | null> {
    if (!adId || !selectedPackage.value) return null
    status.value = 'loading'
    try {
      const session = await paymentsApi.create(adId, selectedPackage.value, returnUrl)
      status.value = 'success'
      return session.redirectUrl
    } catch (e) {
      status.value = 'error'
      error.value = isApiError(e) ? e : { status: 0, code: 'unknown', message: tr('Что-то пошло не так') }
      return null
    }
  }

  function reset() {
    // выход из правки не стирает сохранённый черновик новой подачи
    const wasEditing = !!editingId.value
    draft.value = {}
    step.value = 'section'
    errors.value = {}
    status.value = 'idle'
    error.value = null
    createdId.value = null
    selectedPackage.value = null
    editingId.value = null
    if (import.meta.client && !wasEditing) localStorage.removeItem(KEY)
  }

  return { draft, step, errors, status, error, createdId, packages, selectedPackage, editingId, startEdit, restore, chooseSection, patch, setParam, validate, setStep, loadPackages, publish, generateDescription, uploadImage, pay, reset }
})
