import type { DocumentFull, PromoPackage } from '~/types'

export const promoPackages: PromoPackage[] = [
  { id: 'raise', title: 'Поднять', price: 49, description: 'Поднимем в начало ленты на 7 дней', days: 7 },
  { id: 'highlight', title: 'Выделить', price: 79, description: 'Яркая подсветка в ленте на 7 дней', days: 7 },
  { id: 'max', title: 'Пакет «Максимум»', price: 99, description: 'Поднятие + выделение (экономия 20%)', days: 7 }
]

export const documents: DocumentFull[] = [
  {
    slug: 'privacy', title: 'Политика конфиденциальности', group: 'documents',
    sections: [
      { title: '1. Какие данные мы собираем', text: 'При регистрации мы запрашиваем email и пароль. При размещении объявления - телефон, город и другую информацию, которую вы указываете. Мы также собираем технические данные: IP-адрес, тип устройства, браузер, действия на сайте (просмотры, переходы).' },
      { title: '2. Как мы используем ваши данные', text: 'Email используется для входа и уведомлений. Телефон и другие контакты показываются в объявлении, чтобы пользователи могли связаться с вами. Мы не продаём и не передаём ваши данные третьим лицам, кроме случаев, предусмотренных законом.' },
      { title: '3. Платёжные данные', text: 'При оплате платных услуг вы перенаправляетесь на сайт платёжного провайдера. Мы не храним данные ваших карт - все транзакции проходят на стороне партнёра.' }
    ]
  },
  {
    slug: 'terms', title: 'Условия использования', group: 'documents',
    sections: [
      { title: '1. Общие положения', text: 'Сервис Kango предоставляет площадку для размещения объявлений. Размещение бесплатное, платные опции - поднятие и выделение объявлений.' },
      { title: '2. Ответственность', text: 'Автор объявления отвечает за достоверность информации. Сервис вправе удалять объявления, нарушающие правила.' }
    ]
  },
  {
    slug: 'rules', title: 'Правила размещения', group: 'documents',
    sections: [
      { title: 'Что нельзя публиковать', text: 'Запрещённые товары и услуги, обман, спам, чужие персональные данные.' },
      { title: 'Как работают платные опции', text: 'Поднятие поднимает объявление в начало ленты на 7 дней, выделение подсвечивает его в ленте.' }
    ]
  },
  {
    slug: 'company', title: 'Реквизиты компании', group: 'details',
    sections: [
      { title: 'Юридическое лицо', text: 'Kango Ltd. (заглушка, настоящие реквизиты будут добавлены владельцем проекта).' },
      { title: 'Контакты', text: 'Израиль, Тель-Авив. Почта: support@board.co.il (заглушка).' }
    ]
  }
]

/** Словарь для подсказок поиска: текст и категория */
export const searchVocabulary: { text: string, categoryTitle: string, section: 'work' | 'realty' | 'goods' | 'services' }[] = [
  { text: 'Телевизоры', categoryTitle: 'Электроника и телефоны', section: 'goods' },
  { text: 'Телефоны', categoryTitle: 'Электроника и телефоны', section: 'goods' },
  { text: 'Телята', categoryTitle: 'Сельское хозяйство', section: 'goods' },
  { text: 'Телевизор б/у', categoryTitle: 'Электроника и телефоны', section: 'goods' },
  { text: 'Теплица', categoryTitle: 'Сад и огород', section: 'goods' },
  { text: 'Телевизор Smart tv', categoryTitle: 'Электроника и телефоны', section: 'goods' },
  { text: 'Аренда квартиры', categoryTitle: 'Недвижимость', section: 'realty' },
  { text: 'Квартира в Тель-Авиве', categoryTitle: 'Недвижимость', section: 'realty' },
  { text: 'Дом с садом', categoryTitle: 'Недвижимость', section: 'realty' },
  { text: 'Гитара', categoryTitle: 'Разное', section: 'goods' },
  { text: 'Диван', categoryTitle: 'Мебель', section: 'goods' },
  { text: 'Холодильник', categoryTitle: 'Бытовая техника', section: 'goods' },
  { text: 'Стиральная машина', categoryTitle: 'Бытовая техника', section: 'goods' },
  { text: 'Ноутбук', categoryTitle: 'Электроника и телефоны', section: 'goods' },
  { text: 'iPhone', categoryTitle: 'Электроника и телефоны', section: 'goods' },
  { text: 'Курьер', categoryTitle: 'Водители и Курьеры', section: 'work' },
  { text: 'Официант', categoryTitle: 'Гостинично-ресторанный бизнес', section: 'work' },
  { text: 'Повар', categoryTitle: 'Гостинично-ресторанный бизнес', section: 'work' },
  { text: 'Уборщица', categoryTitle: 'Офисная и Административная работа', section: 'work' },
  { text: 'Сантехник', categoryTitle: 'Бытовые услуги', section: 'services' },
  { text: 'Электрик', categoryTitle: 'Бытовые услуги', section: 'services' },
  { text: 'Ремонт кондиционеров', categoryTitle: 'Бытовые услуги', section: 'services' },
  { text: 'Репетитор', categoryTitle: 'Образование и репетиторство', section: 'services' },
  { text: 'Уборка квартир', categoryTitle: 'Клининг и уборка', section: 'services' }
]
