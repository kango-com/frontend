import { forms } from './forms'
import { ui } from './ui'

export interface DictEntry { en: string, he: string }

/** Словарь переводов: ключ - русский текст */
export const dictionary: Record<string, DictEntry> = { ...ui, ...forms }
