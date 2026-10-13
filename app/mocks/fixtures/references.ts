import type { RefItem } from '~/types'

const ref = (id: string, title: string, parentId?: string): RefItem => ({ id, title, ...(parentId ? { parentId } : {}) })

// ---------- Работа ----------
export const workCategories: RefItem[] = [
  ref('it', 'High-Tech / IT'), ref('sales', 'Продажи и Обслуживание клиентов'), ref('construction', 'Строительство и Недвижимость'),
  ref('production', 'Производство и Логистика'), ref('medicine', 'Медицина и Фармацевтика'), ref('hospitality', 'Гостинично-ресторанный бизнес'),
  ref('education', 'Образование'), ref('finance', 'Финансы и Юриспруденция'), ref('drivers', 'Водители и Курьеры'),
  ref('agriculture', 'Сельское хозяйство'), ref('design', 'Дизайн и Маркетинг'), ref('retail', 'Торговля и Ритейл'),
  ref('beauty', 'Красота и Здоровье'), ref('office', 'Офисная и Административная работа')
]

const positionsByCategory: Record<string, string[]> = {
  hospitality: ['Шеф-повар', 'Су-шеф', 'Повар', 'Стюард кухни', 'Метрдотель / Менеджер зала', 'Старший официант', 'Официант', 'Помощник официанта', 'Бармен', 'Помощник бармена', 'Сомелье', 'Бариста'],
  it: ['Frontend-разработчик', 'Backend-разработчик', 'QA-инженер', 'DevOps-инженер', 'Менеджер проектов'],
  sales: ['Менеджер по продажам', 'Консультант', 'Оператор колл-центра', 'Кассир'],
  construction: ['Разнорабочий', 'Плиточник', 'Маляр', 'Электрик', 'Прораб'],
  production: ['Сборщик заказов', 'Кладовщик', 'Оператор станка', 'Упаковщик'],
  medicine: ['Медсестра', 'Помощник по уходу', 'Фармацевт', 'Администратор клиники'],
  education: ['Репетитор', 'Воспитатель', 'Преподаватель иврита'],
  finance: ['Бухгалтер', 'Юрист', 'Финансовый аналитик'],
  drivers: ['Курьер на скутере', 'Курьер на велосипеде', 'Водитель грузовика', 'Водитель такси'],
  agriculture: ['Сельскохозяйственный рабочий', 'Тракторист'],
  design: ['Графический дизайнер', 'SMM-менеджер', 'Маркетолог'],
  retail: ['Продавец', 'Мерчендайзер', 'Администратор магазина'],
  beauty: ['Мастер маникюра', 'Парикмахер', 'Косметолог', 'Массажист'],
  office: ['Секретарь', 'Офис-менеджер', 'Администратор', 'Уборщица / уборщик помещений']
}

export const workPositions: RefItem[] = Object.entries(positionsByCategory).flatMap(([cat, names]) =>
  names.map((n, i) => ref(`${cat}-p${i + 1}`, n, cat)))

// ---------- Недвижимость ----------
export const realtyCategories: RefItem[] = [
  ref('residential', 'Жилая недвижимость'), ref('commercial', 'Коммерческая недвижимость'),
  ref('land', 'Земля и участки'), ref('abroad', 'Зарубежная недвижимость'), ref('hostel', 'Хостелы')
]
export const realtyTypes: RefItem[] = [
  ref('apartment', 'Квартира', 'residential'), ref('house', 'Дом', 'residential'), ref('studio', 'Студия', 'residential'),
  ref('room', 'Комната', 'residential'),
  ref('office', 'Офис', 'commercial'), ref('shop', 'Магазин', 'commercial'), ref('warehouse', 'Склад', 'commercial'),
  ref('industrial', 'Производственное помещение', 'commercial'), ref('building', 'Здание', 'commercial'),
  ref('plot', 'Участок', 'land'), ref('build-land', 'Земля под строительство', 'land'), ref('agri-land', 'Сельхоз участок', 'land'),
  ref('abroad-any', 'Недвижимость за рубежом', 'abroad'), ref('hostel-any', 'Хостел', 'hostel')
]
export const realtySubtypes: RefItem[] = [
  ref('garden', 'Садовая квартира', 'apartment'), ref('roof', 'Квартира на крыше (Roof)', 'apartment'),
  ref('penthouse', 'Пентхаус', 'apartment'), ref('duplex', 'Дуплекс', 'apartment'),
  ref('villa', 'Вилла', 'house'), ref('cottage', 'Коттедж', 'house'), ref('townhouse', 'Таунхаус', 'house')
]
export const realtyProjects: RefItem[] = [
  ref('aura-ramat', 'Aura Ramat HaSharon', 'ramat-hasharon'), ref('oasis-tlv', 'OASIS TLV', 'tel-aviv'), ref('palace', 'Palace Tel Aviv', 'tel-aviv'),
  ref('four6five', 'FOUR 6FIVE', 'tel-aviv'), ref('utopia', 'Utopia', 'haifa'), ref('aura-strip', 'Aura - The Strip', 'netanya'),
  ref('dimri-yama', 'DIMRI YAMA', 'haifa'), ref('lev-bavli', 'Lev Bavli', 'tel-aviv'), ref('semel', 'Semel Tzafon', 'jerusalem'),
  ref('moza', 'Moza', 'jerusalem')
]
export const realtyDevelopers: RefItem[] = [
  ref('africa', 'Africa Israel Residences', 'palace'), ref('ashtrom', 'Ashtrom Group', 'oasis-tlv'), ref('tidhar', 'Tidhar Group', 'four6five'),
  ref('shikun', 'Shikun & Binui', 'utopia'), ref('electra', 'Electra', 'aura-strip'), ref('dimri', 'Y.H. Dimri', 'dimri-yama'),
  ref('shapir', 'Shapir Engineering & Industries', 'lev-bavli'), ref('amram', 'Amram Avraham Construction Company', 'semel'),
  ref('danya', 'Danya Cebus', 'moza'), ref('aura-dev', 'Aura Israel Development', 'aura-ramat')
]

// ---------- Товары ----------
export const goodsCategories: RefItem[] = [
  ref('electronics', 'Электроника и телефоны'), ref('kids', 'Детские товары'), ref('clothes', 'Одежда'),
  ref('furniture', 'Мебель'), ref('appliances', 'Бытовая техника'), ref('auto', 'Авто'), ref('tools', 'Инструменты')
]
export const goodsSubcategories: RefItem[] = [
  ref('phones', 'Телефоны', 'electronics'), ref('tablets', 'Планшеты', 'electronics'), ref('laptops', 'Ноутбуки', 'electronics'),
  ref('tvs', 'Телевизоры', 'electronics'), ref('consoles', 'Консоли', 'electronics'),
  ref('car-seats', 'Автокресла', 'kids'), ref('toys', 'Игрушки', 'kids'), ref('kids-clothes', 'Детская одежда', 'kids'),
  ref('men', 'Мужская одежда', 'clothes'), ref('women', 'Женская одежда', 'clothes'), ref('shoes', 'Обувь', 'clothes'),
  ref('sofas', 'Диваны', 'furniture'), ref('beds', 'Кровати', 'furniture'), ref('tables', 'Столы', 'furniture'),
  ref('chairs', 'Стулья', 'furniture'), ref('wardrobes', 'Шкафы', 'furniture'),
  ref('washers', 'Стиральные машины', 'appliances'), ref('stoves', 'Плиты', 'appliances'), ref('microwaves', 'Микроволновки', 'appliances'),
  ref('dryers', 'Сушилки', 'appliances'),
  ref('wheels', 'Диски', 'auto'), ref('radios', 'Магнитолы', 'auto'), ref('accessories', 'Аксессуары', 'auto'),
  ref('hand-tools', 'Ручной инструмент', 'tools'), ref('power-tools', 'Электроинструмент', 'tools'), ref('materials', 'Стройматериалы', 'tools')
]
export const goodsBrands: RefItem[] = [
  ref('apple', 'Apple', 'phones'), ref('samsung', 'Samsung', 'phones'), ref('xiaomi', 'Xiaomi', 'phones'), ref('huawei', 'Huawei', 'phones'),
  ref('google', 'Google', 'phones'), ref('oneplus', 'OnePlus', 'phones'), ref('sony', 'Sony', 'phones'), ref('asus', 'Asus', 'phones'),
  ref('oppo', 'Oppo', 'phones'),
  ref('lg', 'LG', 'tvs'), ref('samsung-tv', 'Samsung', 'tvs'), ref('sony-tv', 'Sony', 'tvs'),
  ref('stihl', 'Andreas Stihl', 'power-tools'), ref('bosch', 'Bosch', 'power-tools'), ref('makita', 'Makita', 'power-tools'), ref('bahco', 'Bahco', 'hand-tools'),
  ref('beko', 'Beko', 'washers'), ref('ariston', 'Ariston', 'washers'), ref('ikea', 'IKEA', 'sofas'),
  ref('nike', 'Nike', 'shoes'), ref('adidas', 'Adidas', 'shoes')
]
export const goodsModels: RefItem[] = [
  ref('iphone13', 'iPhone 13 Pro', 'apple'), ref('iphone14', 'iPhone 14 Pro Max', 'apple'), ref('iphone12', 'iPhone 12', 'apple'),
  ref('s23', 'Galaxy S23 Ultra', 'samsung'), ref('s21', 'Galaxy S21 Ultra 128GB', 'samsung'),
  ref('mi13', 'Xiaomi 13 Pro', 'xiaomi'), ref('p50', 'P50 Pro', 'huawei'), ref('pixel7', 'Pixel 7 Pro', 'google'),
  ref('rog5', 'ROG Phone 5', 'asus'), ref('rog7', 'ROG Phone 7', 'asus')
]

// ---------- Услуги ----------
export const servicesCategories: RefItem[] = [
  ref('auto-services', 'Автоуслуги'), ref('accounting', 'Бухгалтерия и финансы'), ref('household', 'Бытовые услуги'),
  ref('cleaning', 'Клининг и уборка'), ref('beauty-services', 'Красота и здоровье'), ref('tutoring', 'Образование и репетиторство'),
  ref('catering', 'Общественное питание и кейтеринг'), ref('logistics', 'Перевозки и логистика'), ref('building', 'Строительные работы'),
  ref('pets', 'Уход за животными'), ref('photo', 'Фото и видео'), ref('legal', 'Юридические услуги')
]
export const servicesSubcategories: RefItem[] = [
  ref('electrics', 'Электрика', 'household'), ref('plumbing', 'Сантехника', 'household'), ref('assembly', 'Сборка мебели', 'household'),
  ref('appliance-repair', 'Ремонт бытовой техники', 'household'),
  ref('painting', 'Малярные работы', 'building'), ref('tiles', 'Плитка и отделка', 'building'), ref('repair', 'Ремонт и стройка', 'building'),
  ref('home-cleaning', 'Уборка квартир и офисов', 'cleaning'), ref('windows', 'Мойка окон', 'cleaning'),
  ref('car-repair', 'Ремонт автомобилей', 'auto-services'), ref('tire', 'Шиномонтаж', 'auto-services'),
  ref('movers', 'Грузчики и переезды', 'logistics'), ref('taxi', 'Такси и трансферы', 'logistics'),
  ref('math', 'Репетитор по математике', 'tutoring'), ref('hebrew', 'Иврит для взрослых', 'tutoring'),
  ref('nails', 'Маникюр', 'beauty-services'), ref('hair', 'Парикмахерские услуги', 'beauty-services'),
  ref('grooming', 'Груминг', 'pets'), ref('dog-walking', 'Выгул собак', 'pets'),
  ref('wedding', 'Свадебная съёмка', 'photo'), ref('portrait', 'Портретная съёмка', 'photo'),
  ref('tax', 'Налоги и отчётность', 'accounting'), ref('contracts', 'Договоры и консультации', 'legal'),
  ref('catering-events', 'Кейтеринг на мероприятия', 'catering')
]

export const byParent = (items: RefItem[], parentId?: string) => (parentId ? items.filter(i => i.parentId === parentId) : items)
