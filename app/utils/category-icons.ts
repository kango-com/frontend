import type { Section } from '~/types'

// Цветные иконки категорий (вырезаны из набора в assets/img/category-icons)
const files = import.meta.glob('../assets/img/category-icons/*.webp', { eager: true, import: 'default' }) as Record<string, string>
const byName: Record<string, string> = {}
for (const [path, url] of Object.entries(files)) byName[path.split('/').pop()!.replace('.webp', '')] = url

/** Иконка раздела */
const SECTION: Record<Section, string> = { work: 'briefcase', realty: 'house', goods: 'bag', services: 'tools' }

/** Иконка категории по разделу и id из справочника */
const CATEGORY: Record<Section, Record<string, string>> = {
  work: {
    it: 'laptop', sales: 'handshake', construction: 'buildings', production: 'box', medicine: 'medkit', hospitality: 'serving-dish',
    education: 'graduation', finance: 'coins', drivers: 'delivery', agriculture: 'plant', design: 'camera', retail: 'price-tag',
    beauty: 'cosmetics', office: 'people'
  },
  realty: { residential: 'house', commercial: 'buildings', land: 'plant', abroad: 'plane', hostel: 'sofa' },
  goods: { electronics: 'phone', kids: 'stroller', clothes: 'tshirt', furniture: 'sofa', appliances: 'washer', auto: 'car', tools: 'tools' },
  services: {
    'auto-services': 'car', 'accounting': 'coins', 'household': 'key', 'cleaning': 'cosmetics', 'beauty-services': 'hearts',
    'tutoring': 'graduation', 'catering': 'serving-dish', 'logistics': 'delivery', 'building': 'tools', 'pets': 'paw',
    'photo': 'camera', 'legal': 'shield'
  }
}

export const sectionIcon = (section: Section): string | undefined => byName[SECTION[section]]
export const categoryIcon = (section: Section, id: string): string | undefined => {
  const name = CATEGORY[section]?.[id]
  return name ? byName[name] : undefined
}
export const categoryIconByName = (name: string): string | undefined => byName[name]
