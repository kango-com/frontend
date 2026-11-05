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

// Центры городов [широта, долгота] (OpenStreetMap, округлено); прибрежные города помечены - точки объявлений сдвигаются только вглубь суши
const CENTER: Record<string, [number, number, 'coast'?]> = {
  'tel-aviv': [32.0853, 34.7818, 'coast'], 'haifa': [32.794, 34.9896, 'coast'], 'jerusalem': [31.7683, 35.2137], 'netanya': [32.3215, 34.8532, 'coast'],
  'arad': [31.2589, 35.2128], 'ariel': [32.1046, 35.1745], 'afula': [32.6078, 35.2897], 'ashdod': [31.8014, 34.6435, 'coast'],
  'ashkelon': [31.6688, 34.5743, 'coast'], 'baka-al-gharbiyye': [32.4192, 35.0417], 'bat-yam': [32.0132, 34.748, 'coast'],
  'beitar-illit': [31.696, 35.12], 'beit-shean': [32.4973, 35.4964], 'beit-shemesh': [31.747, 34.9881], 'beer-sheva': [31.2518, 34.7913],
  'bnei-brak': [32.0807, 34.8338], 'givatayim': [32.0722, 34.8125], 'givat-shmuel': [32.0779, 34.8484], 'herzliya': [32.1624, 34.8447, 'coast'],
  'hadera': [32.434, 34.9196, 'coast'], 'holon': [32.0158, 34.7874], 'eilat': [29.5577, 34.9519, 'coast'], 'yavne': [31.8781, 34.7398],
  'kfar-saba': [32.175, 34.9069], 'karmiel': [32.9171, 35.305], 'kiryat-gat': [31.61, 34.7642], 'kiryat-shmona': [33.2079, 35.5702],
  'lod': [31.9516, 34.8954], 'modiin': [31.898, 35.0104], 'nahariya': [33.0058, 35.0941, 'coast'], 'nazareth': [32.6996, 35.3035],
  'nes-ziona': [31.9293, 34.7987], 'netivot': [31.4231, 34.5885], 'petah-tikva': [32.084, 34.8878], 'raanana': [32.1848, 34.8713],
  'ramat-gan': [32.0684, 34.8248], 'ramat-hasharon': [32.1461, 34.8394], 'ramla': [31.9279, 34.8625], 'rehovot': [31.8928, 34.8113],
  'rishon': [31.973, 34.7925], 'rosh-haayin': [32.0956, 34.9566], 'safed': [32.9646, 35.496], 'sderot': [31.525, 34.5964],
  'tiberias': [32.7922, 35.5312], 'taibe': [32.2662, 35.0089], 'tamra': [32.8536, 35.1979], 'umm-al-fahm': [32.5196, 35.1535],
  'yokneam': [32.6593, 35.1093], 'dimona': [31.07, 35.0333], 'kiryat-ata': [32.809, 35.105], 'kiryat-motzkin': [32.8371, 35.0775],
  'maale-adumim': [31.777, 35.298]
}

export const cities: City[] = CITY_ROWS.map(([id, name, popular]) => {
  const c = CENTER[id]
  return { id, name, ...(popular ? { popular: true } : {}), ...(c ? { coordinates: { lat: c[0], lng: c[1] } } : {}) }
})

/** Точка внутри города: район задаёт направление от центра, `r1`/`r2` (0..1) - разброс. Прибрежный город - только на восток от центра */
export function pointInCity(cityId: string, districtIndex: number, r1: number, r2: number) {
  const c = CENTER[cityId]
  if (!c) return undefined
  const angle = (districtIndex * 2.4) + r1 * 1.2
  const dist = 0.004 + r2 * 0.016
  let dLng = Math.cos(angle) * dist * 1.2
  const dLat = Math.sin(angle) * dist
  if (c[2] === 'coast') dLng = Math.abs(dLng)
  return { lat: +(c[0] + dLat).toFixed(5), lng: +(c[1] + dLng).toFixed(5) }
}

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
