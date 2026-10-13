import type { City, District, RefItem } from '~/types'

// [id, название, популярный]
const CITY_ROWS: [string, string, boolean?][] = [
  ['tel-aviv', 'Тель-Авив', true], ['haifa', 'Хайфа', true], ['jerusalem', 'Иерусалим', true], ['netanya', 'Нетания', true],
  ['arad', 'Арад'], ['ariel', 'Ариэль'], ['afula', 'Афула'], ['ashdod', 'Ашдод'], ['ashkelon', 'Ашкелон'],
  ['baka-al-gharbiyye', 'Бака-эль-Гарбия'], ['bat-yam', 'Бат-Ям'], ['beitar-illit', 'Бейтар-Илит'], ['beit-shean', 'Бейт-Шеан'],
  ['beit-shemesh', 'Бейт-Шемеш'], ['beer-sheva', 'Беэр-Шева'], ['bnei-brak', 'Бней-Брак'], ['givatayim', 'Гиватаим'],
  ['givat-shmuel', 'Гиват-Шмуэль'], ['herzliya', 'Герцлия'], ['hadera', 'Хадера'], ['holon', 'Холон'], ['eilat', 'Эйлат'],
  ['yavne', 'Явне'], ['kfar-saba', 'Кфар-Сава'], ['karmiel', 'Кармиэль'], ['kiryat-gat', 'Кирьят-Гат'], ['kiryat-shmona', 'Кирьят-Шмона'],
  ['lod', 'Лод'], ['modiin', 'Модиин'], ['nahariya', 'Нагария'], ['nazareth', 'Назарет'], ['nes-ziona', 'Нес-Циона'],
  ['netivot', 'Нетивот'], ['petah-tikva', 'Петах-Тиква'], ['raanana', 'Раанана'], ['ramat-gan', 'Рамат-Ган'],
  ['ramat-hasharon', 'Рамат-ха-Шарон'], ['ramla', 'Рамла'], ['rehovot', 'Реховот'], ['rishon', 'Ришон-ле-Цион'],
  ['rosh-haayin', 'Рош-ха-Аин'], ['safed', 'Цфат'], ['sderot', 'Сдерот'], ['tiberias', 'Тверия'], ['taibe', 'Тайбе'],
  ['tamra', 'Тамра'], ['umm-al-fahm', 'Умм-эль-Фахм'], ['yokneam', 'Йокнеам'], ['dimona', 'Димона'], ['kiryat-ata', 'Кирьят-Ата'],
  ['kiryat-motzkin', 'Кирьят-Моцкин'], ['maale-adumim', 'Маале-Адумим']
]

export const cities: City[] = CITY_ROWS.map(([id, name, popular]) => ({ id, name, ...(popular ? { popular: true } : {}) }))

const defaultDistricts = ['Центр', 'Север', 'Юг', 'Восток']
const districtsByCity: Record<string, string[]> = {
  'tel-aviv': ['Центр', 'Яффо', 'Флорентин', 'Неве-Цедек', 'Рамат-Авив', 'Старый север', 'Шапира'],
  'haifa': ['Хадар', 'Кармель', 'Неве-Шаанан', 'Бат-Галим', 'Нижний город', 'Кирьят-Элиэзер'],
  'jerusalem': ['Центр', 'Рехавия', 'Гило', 'Талпиот', 'Махане-Йегуда', 'Рамот', 'Бейт-ха-Керем'],
  'netanya': ['Центр', 'Кирьят-Нордау', 'Ир-Ямим', 'Шаарей-Тиква'],
  'arad': ['Халамиш', 'Авишур', 'Еэлим', 'Ришоним', 'Шакед', 'Левоот', 'Маоф', 'Тлалим', 'Иегошафат', 'Гив\'ат а-Море']
}

export function districtsOf(cityId: string): District[] {
  const names = districtsByCity[cityId] ?? defaultDistricts
  return names.map((name, i) => ({ id: `${cityId}-d${i + 1}`, cityId, name }))
}

export const districts: District[] = cities.flatMap(c => districtsOf(c.id))

const streetNames = ['Ибн Гвироль', 'Дизенгоф', 'Бен-Йехуда', 'Герцль', 'Жаботинский', 'Алленби', 'Рутшильд', 'Пальмовая', 'Лимонная', 'Солнечная', 'Зелёная', 'Давида']
export function streetsOf(cityId: string, districtIds: string[]): RefItem[] {
  const ds = districtsOf(cityId).filter(d => !districtIds.length || districtIds.includes(d.id))
  return ds.flatMap(d => streetNames.slice(0, 6).map((s, i) => ({ id: `${d.id}-s${i + 1}`, title: s, parentId: d.id })))
}

export const cityById = (id: string) => cities.find(c => c.id === id)
