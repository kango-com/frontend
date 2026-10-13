import type { Ad, Hebrew } from '~/types'
import { cities, districtsOf } from './geo'
import { authors } from './users'
import workImage from '~/assets/img/categories/work.webp'
import realtyImage from '~/assets/img/categories/real-estate.webp'
import goodsImage from '~/assets/img/categories/goods.webp'
import servicesImage from '~/assets/img/categories/services.webp'
import apartment1 from '~/assets/img/mock/apartment-1.webp'
import apartment2 from '~/assets/img/mock/apartment-2.webp'
import phone1 from '~/assets/img/mock/phone-1.webp'
import phone2 from '~/assets/img/mock/phone-2.webp'
import sofa from '~/assets/img/mock/sofa.webp'

export type AdRecord = Ad & {
  cityId: string
  districtId?: string
  authorId: string
  /** Условная удалённость в км (для сортировки «По удалённости») */
  distance: number
}

function rng(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rnd = rng(20261013)
const pick = <T>(arr: T[]): T => arr[Math.floor(rnd() * arr.length)]!
const int = (a: number, b: number) => a + Math.floor(rnd() * (b - a + 1))
const some = <T>(arr: T[], max = arr.length): T[] => arr.filter(() => rnd() < 0.4).slice(0, max)

// Города с весами: популярные встречаются чаще
const cityPool = cities.flatMap(c => (c.popular ? Array(8).fill(c) as typeof cities : [c]))

const NOW = Date.now()
const hoursAgo = () => new Date(NOW - int(1, 24 * 14) * 3600_000).toISOString()

const streets = ['Ибн Гвироль', 'Дизенгоф', 'Бен-Йехуда', 'Герцль', 'Жаботинский', 'Алленби', 'Рутшильд', 'Пальмовая', 'Лимонная', 'Солнечная', 'Зелёная', 'Давида']

let counter = 1000
function base(section: Ad['section'], image: string) {
  const city = pick(cityPool)
  const dists = districtsOf(city.id)
  const district = pick(dists)
  const author = pick(authors)
  const id = `a${++counter}`
  const street = `${pick(streets)}, ${int(1, 90)}`
  return {
    id,
    number: 874_539_000 + counter,
    section,
    createdAt: hoursAgo(),
    promoted: rnd() < 0.08,
    highlighted: rnd() < 0.06,
    images: [image, image, image].slice(0, int(1, 3)),
    image,
    city: city.name,
    cityId: city.id,
    district: district.name,
    districtId: district.id,
    address: `${city.name}, ${street}`,
    location: `${city.name}, ${district.name}`,
    authorId: author.id,
    author: { id: author.id, name: author.name, online: author.online, since: author.since },
    contacts: { phone: author.phone, whatsapp: author.phone, telegram: author.telegram },
    distance: int(1, 220)
  }
}

// ---------- Работа ----------
const workTemplates: { title: string, cat: string, pos: string, employer: string, wage: number, schedule: string[], hebrew: Hebrew, exp: 'none' | 'required' }[] = [
  { title: 'Требуется уборщица / уборщик помещений', cat: 'office', pos: 'office-p4', employer: 'Золотое яблоко', wage: 45, schedule: ['Дневные смены'], hebrew: 'none', exp: 'none' },
  { title: 'Кассир в супермаркет', cat: 'sales', pos: 'sales-p4', employer: 'Супермаркет «Магнит»', wage: 38, schedule: ['Полная занятость'], hebrew: 'any', exp: 'none' },
  { title: 'Помощник официанта', cat: 'hospitality', pos: 'hospitality-p8', employer: 'Кафе «Луна»', wage: 42, schedule: ['Вечерние смены'], hebrew: 'none', exp: 'none' },
  { title: 'Сборщик заказов', cat: 'production', pos: 'production-p1', employer: 'Компания «Деливери»', wage: 40, schedule: ['Дневные смены', 'Вечерние смены'], hebrew: 'any', exp: 'none' },
  { title: 'Оператор колл-центра', cat: 'sales', pos: 'sales-p3', employer: 'Служба поддержки «Техно»', wage: 50, schedule: ['Гибкий график'], hebrew: 'required', exp: 'required' },
  { title: 'Курьер на велосипеде', cat: 'drivers', pos: 'drivers-p2', employer: 'Служба доставки «ВелоЭкспресс»', wage: 35, schedule: ['Свободный график'], hebrew: 'none', exp: 'none' },
  { title: 'Повар в ресторан', cat: 'hospitality', pos: 'hospitality-p3', employer: 'Ресторан «Олива»', wage: 55, schedule: ['Дневные смены', 'Ночные смены'], hebrew: 'any', exp: 'required' },
  { title: 'Официант на полную ставку', cat: 'hospitality', pos: 'hospitality-p7', employer: 'Бар «Маяк»', wage: 48, schedule: ['Вечерние смены'], hebrew: 'any', exp: 'none' },
  { title: 'Frontend-разработчик (Vue)', cat: 'it', pos: 'it-p1', employer: 'Studio Kango', wage: 140, schedule: ['Гибкий график'], hebrew: 'none', exp: 'required' },
  { title: 'Плиточник на объект', cat: 'construction', pos: 'construction-p2', employer: 'Бригада Леви', wage: 90, schedule: ['Дневные смены'], hebrew: 'none', exp: 'required' },
  { title: 'Мастер маникюра в салон', cat: 'beauty', pos: 'beauty-p1', employer: 'Салон «Лилия»', wage: 70, schedule: ['Сменный график'], hebrew: 'any', exp: 'required' },
  { title: 'Продавец-консультант', cat: 'retail', pos: 'retail-p1', employer: 'Магазин «Эрмитаж»', wage: 40, schedule: ['Дневные смены'], hebrew: 'required', exp: 'none' }
]

function makeWork(): AdRecord {
  const t = pick(workTemplates)
  const b = base('work', workImage)
  const wage = t.wage + int(-3, 6)
  const employment = pick([['Полная занятость'], ['Частичная занятость'], ['Подработка']])
  const tags = [...t.schedule.slice(0, 1), t.exp === 'none' ? 'Без опыта' : 'Нужен опыт']
  return {
    ...b,
    title: t.title,
    price: { amount: wage, currency: 'ILS', period: 'hour' },
    tags,
    employer: t.employer,
    description: `${t.employer} приглашает: ${t.title.toLowerCase()}. Работа в городе ${b.city}. Своевременная оплата, помощь с оформлением документов.`,
    params: {
      categoryId: t.cat,
      positionId: t.pos,
      hebrew: t.hebrew,
      schedule: t.schedule,
      employment,
      conditions: some(['Подвозка', 'Питание', 'Проживание']),
      experience: t.exp,
      ageLimit: rnd() < 0.2 ? pick([45, 50, 55, 60]) : undefined,
      salaryFrom: wage,
      salaryTo: wage + int(0, 10)
    }
  } as AdRecord
}

// ---------- Недвижимость ----------
const features = ['Балкон', 'Лифт', 'Парковка', 'Кондиционер', 'Мебель', 'Кладовка', 'После ремонта', 'Мамад']

function makeRealty(): AdRecord {
  const photo = pick([apartment1, apartment2, realtyImage])
  const b = base('realty', photo)
  const deal: 'rent' | 'sale' = rnd() < 0.62 ? 'rent' : 'sale'
  const house = rnd() < 0.2
  const rooms = int(1, 5)
  const area = rooms * int(22, 30) + int(0, 14)
  const type = house ? 'house' : 'apartment'
  const subtype = house ? pick(['villa', 'cottage', 'townhouse']) : (rnd() < 0.25 ? pick(['garden', 'roof', 'penthouse', 'duplex']) : undefined)
  const price = deal === 'rent' ? int(30, 90) * 100 : int(70, 380) * 10_000
  const floors = int(4, 14)
  const title = house
    ? `Дом ${area} м2, ${b.city}`
    : `${rooms}-к. квартира, ${area} м2`
  return {
    ...b,
    title,
    price: { amount: price, currency: 'ILS', period: deal === 'rent' ? 'month' : 'total' },
    tags: [deal === 'rent' ? 'Аренда' : 'Продажа'],
    location: b.address!,
    description: `Светлая квартира в хорошем районе. Рядом супермаркет, парк, транспорт. Подходит для семьи.`,
    params: {
      deal,
      category: 'residential',
      market: deal === 'sale' ? (rnd() < 0.3 ? 'new' : 'secondary') : undefined,
      type,
      subtype,
      rooms,
      area,
      floor: house ? undefined : int(1, floors),
      floors,
      bathrooms: int(1, 3),
      features: some(features),
      extras: some(['Сукка-балкон', 'Вид на море', 'Доступ для инвалидов', 'Солнечный бойлер', 'Крытая парковка', 'Частная парковка']),
      rent: deal === 'rent'
        ? { moveInDate: new Date(NOW + int(1, 60) * 86400_000).toISOString().slice(0, 10), longTerm: rnd() < 0.8, daily: rnd() < 0.1, sublet: rnd() < 0.1, pets: rnd() < 0.4, arnona: rnd() < 0.3, vaadBait: rnd() < 0.3 }
        : undefined
    }
  } as AdRecord
}

// ---------- Товары ----------
const goodsTemplates: { title: string, cat: string, sub: string, brand?: string, model?: string, price: number }[] = [
  { title: 'iPhone 13 Pro 256GB', cat: 'electronics', sub: 'phones', brand: 'apple', model: 'iphone13', price: 3200 },
  { title: 'iPhone 14 Pro Max', cat: 'electronics', sub: 'phones', brand: 'apple', model: 'iphone14', price: 3800 },
  { title: 'Samsung Galaxy S23 Ultra', cat: 'electronics', sub: 'phones', brand: 'samsung', model: 's23', price: 2900 },
  { title: 'Xiaomi 13 Pro', cat: 'electronics', sub: 'phones', brand: 'xiaomi', model: 'mi13', price: 2300 },
  { title: 'Телевизор LG 55 дюймов', cat: 'electronics', sub: 'tvs', brand: 'lg', price: 1700 },
  { title: 'Телевизор Smart tv Samsung', cat: 'electronics', sub: 'tvs', brand: 'samsung-tv', price: 1900 },
  { title: 'Продам угловой диван, Икеа, новый', cat: 'furniture', sub: 'sofas', brand: 'ikea', price: 2200 },
  { title: 'Стиральная машина Beko 8 кг', cat: 'appliances', sub: 'washers', brand: 'beko', price: 900 },
  { title: 'Дрель-шуруповёрт Bosch', cat: 'tools', sub: 'power-tools', brand: 'bosch', price: 350 },
  { title: 'Кроссовки Nike Air, 42', cat: 'clothes', sub: 'shoes', brand: 'nike', price: 280 },
  { title: 'Детское автокресло', cat: 'kids', sub: 'car-seats', price: 400 },
  { title: 'Кровать двуспальная с матрасом', cat: 'furniture', sub: 'beds', price: 1500 }
]

function makeGoods(): AdRecord {
  const t = pick(goodsTemplates)
  const photo = t.sub === 'phones' ? pick([phone1, phone2]) : ['sofas', 'beds', 'tables', 'chairs', 'wardrobes'].includes(t.sub) ? sofa : goodsImage
  const b = base('goods', photo)
  const price = Math.round(t.price * (0.8 + rnd() * 0.4) / 10) * 10
  const condition: 'used' | 'new' = rnd() < 0.7 ? 'used' : 'new'
  return {
    ...b,
    title: t.title,
    price: { amount: price, currency: 'ILS', period: 'total' },
    tags: [condition === 'used' ? 'Б/У' : 'Новый'],
    description: `${t.title}. Состояние отличное, продаю по причине переезда. Торг уместен.`,
    params: {
      categoryId: t.cat,
      subcategoryId: t.sub,
      brandId: t.brand,
      modelId: t.model,
      condition,
      handover: some(['Самовывоз', 'Доставка', 'Встреча']).concat(['Самовывоз']).slice(0, 2),
      bargain: rnd() < 0.5
    }
  } as AdRecord
}

// ---------- Услуги ----------
const servicesTemplates: { title: string, cat: string, sub: string, price: number, note: string }[] = [
  { title: 'Услуги сантехника, замена труб, радиаторов', cat: 'household', sub: 'plumbing', price: 50, note: 'Выезд на дом' },
  { title: 'Ремонт электропроводки, установка розеток', cat: 'household', sub: 'electrics', price: 120, note: 'Гарантия 1 год' },
  { title: 'Установка и ремонт кондиционеров', cat: 'household', sub: 'appliance-repair', price: 80, note: 'Быстрый сервис' },
  { title: 'Уборка квартир и офисов', cat: 'cleaning', sub: 'home-cleaning', price: 65, note: 'Экологичные средства' },
  { title: 'Ремонт бытовой техники (стиральные, холодильники)', cat: 'household', sub: 'appliance-repair', price: 150, note: 'Диагностика бесплатно' },
  { title: 'Малярные работы и поклейка обоев', cat: 'building', sub: 'painting', price: 90, note: 'Выезд на дом' },
  { title: 'Репетитор по математике, 5-11 класс', cat: 'tutoring', sub: 'math', price: 120, note: 'Онлайн' },
  { title: 'Грузчики и переезды по Израилю', cat: 'logistics', sub: 'movers', price: 200, note: 'Круглосуточно' },
  { title: 'Маникюр и педикюр с выездом', cat: 'beauty-services', sub: 'nails', price: 130, note: 'Выезд на дом' }
]

function makeService(): AdRecord {
  const t = pick(servicesTemplates)
  const b = base('services', servicesImage)
  const formats = some(['Выезд на дом', 'Онлайн', 'По адресу исполнителя']).concat(['Выезд на дом']).slice(0, 2)
  const round = t.note === 'Круглосуточно' || rnd() < 0.15
  return {
    ...b,
    title: t.title,
    price: { amount: t.price + int(-10, 30), currency: 'ILS', from: true },
    tags: [t.note],
    description: `${t.title}. Опыт более 5 лет, работаю аккуратно и в срок. Ответ в течение часа.`,
    params: { categoryId: t.cat, subcategoryId: t.sub, formats, roundTheClock: round }
  } as AdRecord
}

export function buildAds(): AdRecord[] {
  const out: AdRecord[] = []
  for (let i = 0; i < 150; i++) {
    out.push(makeWork(), makeRealty(), makeGoods(), makeService())
  }
  return out
}
