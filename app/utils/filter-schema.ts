import type { FilterState, RefItem, Section } from '~/types'

/** Откуда берутся варианты выбора: ключ кэша и загрузчик. null - зависимость ещё не выбрана, поле неактивно */
export type RefSource = (filter: FilterState) => { key: string, load: () => Promise<RefItem[]> } | null

interface FieldBase {
  /** Поля, которые сбрасываются в значения по умолчанию при изменении этого (например, должности при смене категории) */
  resets?: string[]
  /** Поле показывается, только если условие выполнено */
  visible?: (filter: FilterState) => boolean
}

/** Выбор из длинного списка на отдельном экране (категория, должность, бренд) */
export interface SelectField extends FieldBase {
  type: 'select'
  key: string
  label: string
  /** Подпись значения по умолчанию: «Любая», «Любой» */
  anyLabel: string
  multiple?: boolean
  placeholder?: string
  searchPlaceholder: string
  ref: RefSource
}

/** Короткий набор вариантов чипами */
export interface OptionsField extends FieldBase {
  type: 'options'
  key: string
  label: string
  options: { value: string, label: string }[]
  multiple?: boolean
}

/** Диапазон «от и до» */
export interface RangeField extends FieldBase {
  type: 'range'
  fromKey: string
  toKey: string
  label: string
  unit?: string
}

/** Переключатель да/нет */
export interface SwitchField extends FieldBase {
  type: 'switch'
  key: string
  label: string
}

export type FieldDef = SelectField | OptionsField | RangeField | SwitchField

/**
 * Поля фильтров по разделам. Общие поля («Где искать», «Сортировка») добавляет сама панель,
 * поля разделов добавляются в задачах 0030-0033 без правки каркаса.
 */
export const FILTER_SCHEMA: Record<Section, FieldDef[]> = {
  work: [],
  realty: [],
  goods: [],
  services: []
}

export const SECTION_OPTIONS: { value: Section, label: string }[] = [
  { value: 'work', label: 'Работа' },
  { value: 'realty', label: 'Недвижимость' },
  { value: 'goods', label: 'Товары' },
  { value: 'services', label: 'Услуги' }
]

/** Максимум точного числа в кнопке: дальше «более 1 тыс.» */
export const COUNT_CAP = 1000

/** Текст кнопки применения: «Показать 954 объявления», «Показать более 1 тыс. объявлений» */
export function applyLabel(count: number | null, plural: (n: number) => string): string {
  if (count === null) return 'Показать объявления'
  if (count >= COUNT_CAP) return 'Показать более 1 тыс. объявлений'
  return `Показать ${plural(count)}`
}
