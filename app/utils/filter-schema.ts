import { geoApi, referencesApi } from '~/api'
import type { FilterState, RefItem, Section } from '~/types'
import { defaultValue } from './filters'
import { tr } from './tr'

/** Откуда берутся варианты выбора: ключ кэша и загрузчик. null - зависимость ещё не выбрана, поле неактивно */
export type RefSource = (filter: FilterState) => { key: string, load: () => Promise<RefItem[]> } | null

interface FieldBase {
  /** Поля, которые сбрасываются в значения по умолчанию при изменении этого (например, должности при смене категории) */
  resets?: string[]
  /** Поле показывается, только если условие выполнено */
  visible?: (filter: FilterState) => boolean
  /** Дополнительные изменения других полей при выборе значения (например, тип по умолчанию для категории) */
  onChange?: (value: unknown, filter: FilterState) => Record<string, unknown>
}

/** Выбор из длинного списка на отдельном экране (категория, должность, бренд) */
export interface SelectField extends FieldBase {
  type: 'select'
  key: string
  label: string
  /** Подпись значения по умолчанию: «Любая», «Любой» */
  anyLabel: string
  multiple?: boolean
  /** Нет строки «по умолчанию» в списке: значение всегда выбрано (тип сделки, категория) */
  required?: boolean
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
  /** Значение хранится числом (ограничение возраста) */
  numeric?: boolean
  /** Одиночный выбор без снятия: повторный тап по выбранному ничего не меняет (тип сделки) */
  required?: boolean
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

/** Дата (YYYY-MM-DD) через календарь */
export interface DateField extends FieldBase {
  type: 'date'
  key: string
  label: string
  placeholder?: string
}

export type FieldDef = SelectField | OptionsField | RangeField | SwitchField | DateField

const opts = (...labels: string[]) => labels.map(l => ({ value: l, label: l }))
const opt = (value: string, label: string) => ({ value, label })

const asWork = (f: FilterState) => f as Extract<FilterState, { section: 'work' }>
const asRealty = (f: FilterState) => f as Extract<FilterState, { section: 'realty' }>
const asGoods = (f: FilterState) => f as Extract<FilterState, { section: 'goods' }>
const asServices = (f: FilterState) => f as Extract<FilterState, { section: 'services' }>

/** Тип объекта по умолчанию для категории недвижимости */
const REALTY_DEFAULT_TYPE: Record<string, string> = {
  residential: 'apartment', commercial: 'office', land: 'plot', abroad: 'abroad-any', hostel: 'hostel-any'
}

const rooms = (f: FilterState) => asRealty(f).category === 'residential' && ['apartment', 'house'].includes(asRealty(f).type)
const forResidential = (f: FilterState) => asRealty(f).category === 'residential'

/**
 * Поля фильтров по разделам. Общие поля («Где искать», «Сортировка») добавляет сама панель.
 * Справочники приходят из API, значения вариантов - то, что хранит объявление.
 */
export const FILTER_SCHEMA: Record<Section, FieldDef[]> = {
  work: [
    { type: 'select', key: 'categoryId', label: 'Категория', anyLabel: 'Любая', searchPlaceholder: 'Поиск категории', resets: ['positionIds'], ref: () => ({ key: 'work.categories', load: referencesApi.workCategories }) },
    {
      type: 'select', key: 'positionIds', label: 'Должность', anyLabel: 'Любая', multiple: true, searchPlaceholder: 'Поиск должности',
      ref: f => ({ key: `work.positions:${asWork(f).categoryId ?? 'all'}`, load: () => referencesApi.workPositions(asWork(f).categoryId ?? '') })
    },
    { type: 'options', key: 'hebrew', label: 'Иврит', options: [opt('any', 'Не важно'), opt('required', 'Требуется иврит'), opt('none', 'Без иврита')] },
    { type: 'options', key: 'schedule', label: 'Тип графика', multiple: true, options: opts('Дневные смены', 'Вечерние смены', 'Ночные смены', 'Гибкий график') },
    { type: 'options', key: 'employment', label: 'Занятость', multiple: true, options: opts('Полная занятость', 'Частичная занятость', 'Подработка') },
    { type: 'range', fromKey: 'priceFrom', toKey: 'priceTo', label: 'Зарплата', unit: '₪' },
    { type: 'options', key: 'salaryPeriod', label: 'Период зарплаты', options: [opt('month', 'В месяц'), opt('week', 'В неделю'), opt('shift', 'За смену')] },
    { type: 'options', key: 'conditions', label: 'Условия', multiple: true, options: opts('Подвозка', 'Питание', 'Проживание') },
    { type: 'options', key: 'experience', label: 'Опыт', options: [opt('required', 'Требуется опыт'), opt('none', 'Без опыта')] },
    { type: 'options', key: 'ageLimit', label: 'Ограничения по возрасту', numeric: true, options: ['45', '50', '55', '60'].map(a => opt(a, `До ${a} лет`)) }
  ],

  realty: [
    { type: 'options', key: 'deal', label: 'Тип сделки', required: true, options: [opt('rent', 'Аренда'), opt('sale', 'Продажа')], onChange: v => (v === 'sale' ? { market: 'secondary' } : { market: undefined, projectIds: [], developerIds: [] }) },
    {
      type: 'select', key: 'category', label: 'Категория', anyLabel: 'Жилая недвижимость', required: true, searchPlaceholder: 'Поиск категории',
      resets: ['subtype', 'rooms', 'features', 'extras'],
      onChange: (v, f) => ({
        type: REALTY_DEFAULT_TYPE[String(v)] ?? 'apartment',
        market: String(v) === 'residential' && asRealty(f).deal === 'sale' ? 'secondary' : undefined,
        projectIds: [],
        developerIds: []
      }),
      ref: () => ({ key: 'realty.categories', load: referencesApi.realtyCategories })
    },
    {
      type: 'select', key: 'type', label: 'Тип объекта', anyLabel: 'Квартира', required: true, searchPlaceholder: 'Поиск типа', resets: ['subtype'],
      ref: f => ({ key: `realty.types:${asRealty(f).category}`, load: () => referencesApi.realtyTypes(asRealty(f).category) })
    },
    {
      type: 'select', key: 'subtype', label: 'Подтип', anyLabel: 'Любой', searchPlaceholder: 'Поиск подтипа',
      visible: f => ['apartment', 'house'].includes(asRealty(f).type),
      ref: f => ({ key: `realty.subtypes:${asRealty(f).type}`, load: () => referencesApi.realtySubtypes(asRealty(f).type) })
    },
    { type: 'options', key: 'market', label: 'Рынок', options: [opt('secondary', 'Вторичный'), opt('new', 'Новостройка')], visible: f => asRealty(f).deal === 'sale' && forResidential(f) },
    {
      type: 'select', key: 'districtIds', label: 'Район', anyLabel: 'Любой', multiple: true, searchPlaceholder: 'Поиск района',
      ref: f => ({ key: `geo.districts:${f.cityIds.join(',') || 'all'}`, load: async () => (await geoApi.districts(f.cityIds)).map(d => ({ id: d.id, title: d.name, parentId: d.cityId })) })
    },
    {
      type: 'select', key: 'projectIds', label: 'Жилой комплекс', anyLabel: 'Любой', multiple: true, searchPlaceholder: 'Поиск ЖК', resets: ['developerIds'],
      visible: f => asRealty(f).market === 'new' && forResidential(f),
      ref: f => ({ key: `realty.projects:${f.cityIds.join(',') || 'all'}`, load: () => referencesApi.realtyProjects(f.cityIds) })
    },
    {
      type: 'select', key: 'developerIds', label: 'Застройщик', anyLabel: 'Любой', multiple: true, searchPlaceholder: 'Поиск застройщика',
      visible: f => asRealty(f).market === 'new' && forResidential(f),
      ref: f => ({ key: `realty.developers:${asRealty(f).projectIds.join(',') || 'all'}`, load: () => referencesApi.realtyDevelopers(asRealty(f).projectIds) })
    },
    { type: 'range', fromKey: 'priceFrom', toKey: 'priceTo', label: 'Арендная плата', unit: '₪', visible: f => asRealty(f).deal === 'rent' },
    { type: 'range', fromKey: 'priceFrom', toKey: 'priceTo', label: 'Цена', unit: '₪', visible: f => asRealty(f).deal === 'sale' },
    { type: 'options', key: 'rooms', label: 'Количество комнат', options: [opt('1', '1'), opt('2', '2'), opt('3', '3'), opt('4', '4'), opt('5+', '5+')], visible: rooms },
    { type: 'range', fromKey: 'areaFrom', toKey: 'areaTo', label: 'Площадь', unit: 'м2', visible: f => forResidential(f) },
    { type: 'range', fromKey: 'floorFrom', toKey: 'floorTo', label: 'Этаж', visible: f => asRealty(f).type === 'apartment' },
    { type: 'options', key: 'features', label: 'Параметры', multiple: true, options: opts('Балкон', 'Лифт', 'Парковка', 'Кондиционер', 'Мебель', 'Кладовка', 'После ремонта', 'Мамад'), visible: rooms },
    { type: 'options', key: 'extras', label: 'Дополнительные параметры', multiple: true, options: opts('Сукка-балкон', 'Вид на море', 'Доступ для инвалидов', 'Солнечный бойлер', 'Крытая парковка', 'Частная парковка'), visible: rooms },
    {
      type: 'options', key: 'rent', label: 'Параметры аренды', multiple: true,
      options: [opt('longTerm', 'Долгосрочная'), opt('daily', 'Посуточно'), opt('sublet', 'Субаренда'), opt('pets', 'Можно с животными'), opt('arnona', 'Арнона включена'), opt('vaadBait', 'Ваад байт включён')],
      visible: f => asRealty(f).deal === 'rent'
    },
    { type: 'date', key: 'moveInBefore', label: 'Дата въезда', placeholder: 'Любая', visible: f => asRealty(f).deal === 'rent' }
  ],

  goods: [
    { type: 'select', key: 'categoryId', label: 'Категория', anyLabel: 'Любая', searchPlaceholder: 'Поиск категории', resets: ['subcategoryId', 'brandIds', 'modelIds', 'gender', 'age', 'size'], ref: () => ({ key: 'goods.categories', load: referencesApi.goodsCategories }) },
    {
      type: 'select', key: 'subcategoryId', label: 'Подкатегория', anyLabel: 'Любая', searchPlaceholder: 'Поиск подкатегории', resets: ['brandIds', 'modelIds', 'gender', 'size'],
      visible: f => !!asGoods(f).categoryId,
      ref: f => ({ key: `goods.subcategories:${asGoods(f).categoryId}`, load: () => referencesApi.goodsSubcategories(asGoods(f).categoryId ?? '') })
    },
    {
      type: 'select', key: 'brandIds', label: 'Бренд', anyLabel: 'Любой', multiple: true, searchPlaceholder: 'Поиск бренда', resets: ['modelIds'],
      ref: f => ({ key: `goods.brands:${asGoods(f).subcategoryId ?? ''}:${asGoods(f).categoryId ?? ''}`, load: () => referencesApi.goodsBrands(asGoods(f).subcategoryId, asGoods(f).categoryId) })
    },
    {
      type: 'select', key: 'modelIds', label: 'Модель', anyLabel: 'Любая', multiple: true, searchPlaceholder: 'Поиск модели',
      visible: f => asGoods(f).brandIds.length > 0,
      ref: f => ({ key: `goods.models:${asGoods(f).brandIds.join(',')}`, load: () => referencesApi.goodsModels(asGoods(f).brandIds) })
    },
    { type: 'options', key: 'gender', label: 'Пол', options: [opt('male', 'Мужской'), opt('female', 'Женский')], visible: f => ['shoes', 'kids-clothes'].includes(asGoods(f).subcategoryId ?? '') },
    { type: 'options', key: 'age', label: 'Возраст, лет', options: opts('0-1', '1-3', '3-7', '7-12', '12+'), visible: f => asGoods(f).categoryId === 'kids' },
    { type: 'range', fromKey: 'priceFrom', toKey: 'priceTo', label: 'Цена', unit: '₪' },
    { type: 'options', key: 'condition', label: 'Состояние', options: [opt('used', 'Б/У'), opt('new', 'Новый')] },
    { type: 'options', key: 'handover', label: 'Формат передачи', multiple: true, options: opts('Самовывоз', 'Доставка', 'Встреча') },
    { type: 'options', key: 'bargain', label: 'Торг', options: [opt('possible', 'Возможен'), opt('impossible', 'Невозможен')] }
  ],

  services: [
    { type: 'select', key: 'categoryId', label: 'Категория', anyLabel: 'Любая', searchPlaceholder: 'Поиск категории', resets: ['subcategoryId'], ref: () => ({ key: 'services.categories', load: referencesApi.servicesCategories }) },
    {
      type: 'select', key: 'subcategoryId', label: 'Подкатегория', anyLabel: 'Любая', searchPlaceholder: 'Поиск подкатегории',
      visible: f => !!asServices(f).categoryId,
      ref: f => ({ key: `services.subcategories:${asServices(f).categoryId}`, load: () => referencesApi.servicesSubcategories(asServices(f).categoryId ?? '') })
    },
    { type: 'range', fromKey: 'priceFrom', toKey: 'priceTo', label: 'Цена', unit: '₪' },
    { type: 'options', key: 'formats', label: 'Формат оказания услуг', multiple: true, options: opts('Выезд на дом', 'Онлайн', 'По адресу исполнителя') },
    {
      type: 'select', key: 'districtIds', label: 'Район', anyLabel: 'Любой', multiple: true, searchPlaceholder: 'Поиск района',
      visible: f => asServices(f).formats.includes('По адресу исполнителя'),
      ref: f => ({ key: `geo.districts:${f.cityIds.join(',') || 'all'}`, load: async () => (await geoApi.districts(f.cityIds)).map(d => ({ id: d.id, title: d.name, parentId: d.cityId })) })
    },
    { type: 'switch', key: 'roundTheClock', label: 'Круглосуточно' }
  ]
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
  if (count === null) return tr('Показать объявления')
  if (count >= COUNT_CAP) return tr('Показать более 1 тыс. объявлений')
  return tr('Показать {count}', { count: plural(count) })
}

/**
 * Значения скрытых полей, которые нужно вернуть к умолчанию (скрытое поле не должно влиять на счётчик и список).
 * Ключ, который использует хоть одно видимое поле, не трогаем (цена в аренде и продаже).
 */
export function hiddenDefaults(section: Section, filter: FilterState): Record<string, unknown> {
  const keysOf = (f: FieldDef) => (f.type === 'range' ? [f.fromKey, f.toKey] : [f.key])
  const fields = FILTER_SCHEMA[section]
  const visible = new Set(fields.filter(f => !f.visible || f.visible(filter)).flatMap(keysOf))
  const rec = filter as unknown as Record<string, unknown>
  const out: Record<string, unknown> = {}
  for (const f of fields) {
    if (!f.visible || f.visible(filter)) continue
    for (const k of keysOf(f)) {
      if (visible.has(k)) continue
      const d = defaultValue(section, k)
      if (JSON.stringify(rec[k]) !== JSON.stringify(d)) out[k] = d
    }
  }
  return out
}

/** Поля, зависящие от выбранных городов (при смене городов сбрасываются) */
export const CITY_DEPENDENT: Record<Section, string[]> = {
  work: [],
  realty: ['districtIds', 'projectIds', 'developerIds'],
  goods: [],
  services: ['districtIds']
}
