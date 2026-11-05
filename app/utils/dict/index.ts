import { cabinet } from './cabinet'
import { chat } from './chat'
import { forms } from './forms'
import { map } from './map'
import { ui } from './ui'

export interface DictEntry { en: string, he: string }

/** Словарь переводов: ключ - русский текст */
export const dictionary: Record<string, DictEntry> = { ...ui, ...forms, ...cabinet, ...chat, ...map }
