import { dictionary } from './dict'

/**
 * Перевод строки интерфейса. Исходный текст русский и служит ключом словаря (`utils/dict`).
 * Параметры подставляются в `{имя}`. Если перевода нет, возвращается русский текст.
 * Текущий язык берётся из i18n (реактивно, перерисовка при переключении).
 */
export function tr(text: string | null | undefined, params?: Record<string, string | number | undefined>): string {
  if (!text) return ''
  let locale = 'ru'
  try {
    locale = (useNuxtApp().$i18n as { locale: { value: string } }).locale.value
  } catch { /* вне контекста Nuxt остаётся русский */ }
  let out = locale === 'ru' ? text : ((dictionary[text] as Record<string, string> | undefined)?.[locale] ?? text)
  if (params) out = out.replace(/\{(\w+)\}/g, (_, k: string) => String(params[k] ?? ''))
  return out
}

/** Перевод составной строки через запятую («Тель-Авив, Рамат-Авив»): каждая часть отдельно */
export function trl(text: string | undefined): string {
  if (!text) return ''
  return text.split(', ').map(part => tr(part)).join(', ')
}
