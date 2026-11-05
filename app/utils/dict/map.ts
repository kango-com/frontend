// Переводы карты (задача 0045): [русский текст (ключ), английский, иврит]
const rows: [string, string, string][] = [
  // карта в выдаче
  ['Карта объявлений', 'Ads map', 'מפת מודעות'],
  ['Загрузка карты...', 'Loading map...', 'טוען מפה...'],
  ['Не удалось загрузить карту. Обновите страницу.', 'Could not load the map. Refresh the page.', 'לא ניתן לטעון את המפה. רעננו את הדף.'],
  ['Подложка карты недоступна. Метки объявлений показаны.', 'The base map is unavailable. Ad markers are shown.', 'רקע המפה אינו זמין. סמני המודעות מוצגים.'],
  ['приблизительное место', 'approximate location', 'מיקום משוער'],
  ['Объявлений в группе: {n}. Приблизить', 'Ads in group: {n}. Zoom in', 'מודעות בקבוצה: {n}. הגדלה'],
  ['Обведите нужный район пальцем или мышью', 'Draw around the area with your finger or mouse', 'סמנו את האזור הרצוי באצבע או בעכבר'],
  ['Обведите нужный район', 'Draw around the area', 'סמנו את האזור הרצוי'],
  ['Обвести область', 'Draw area', 'סימון אזור'],
  ['Обвести заново', 'Redraw', 'סימון מחדש'],
  ['Сбросить область', 'Clear area', 'ניקוי האזור'],
  ['Обновляем...', 'Updating...', 'מעדכנים...'],
  ['{count} на карте', '{count} on the map', '{count} במפה'],
  ['{count} в обведённой области', '{count} in the drawn area', '{count} באזור המסומן'],
  ['Объявления на карте', 'Ads on the map', 'מודעות במפה'],
  ['В этой области ничего нет. Отдалите карту или измените фильтры.', 'Nothing in this area. Zoom out or change the filters.', 'אין כלום באזור הזה. הקטינו את המפה או שנו את הסינון.'],
  ['Показать ещё', 'Show more', 'הצגת עוד'],
  ['Списком', 'As a list', 'כרשימה'],
  ['Список', 'List', 'רשימה'],

  // карта в карточке объявления
  ['На карте', 'On the map', 'במפה'],
  ['Автор скрыл точный адрес. Показан район в радиусе около 400 м.', 'The author hid the exact address. The area within about 400 m is shown.', 'המפרסם הסתיר את הכתובת המדויקת. מוצג אזור ברדיוס של כ-400 מ׳.'],
  ['Карта: {title}', 'Map: {title}', 'מפה: {title}'],
  ['Открыть на карте', 'Open on the map', 'פתיחה במפה'],
  ['Маршрут в Waze', 'Route in Waze', 'ניווט ב-Waze'],
  ['Маршрут в Google Maps', 'Route in Google Maps', 'ניווט ב-Google Maps'],

  // точка при подаче объявления
  ['Место объекта', 'Property location', 'מיקום הנכס'],
  ['Карта: место объекта', 'Map: property location', 'מפה: מיקום הנכס'],
  ['Укажите город и адрес - метка встанет сама. Её можно передвинуть.', 'Enter the city and address - the marker will be placed automatically. You can move it.', 'הזינו עיר וכתובת - הסמן ימוקם אוטומטית. אפשר להזיז אותו.'],
  ['Ищем адрес на карте...', 'Looking up the address...', 'מחפשים את הכתובת במפה...'],
  ['Проверьте метку. Если она стоит неточно, перетащите её или нажмите на нужное место.', 'Check the marker. If it is off, drag it or tap the right spot.', 'בדקו את הסמן. אם הוא לא מדויק, גררו אותו או הקישו על המקום הנכון.'],
  ['Нашли только город. Укажите улицу и дом или поставьте метку вручную.', 'Only the city was found. Enter the street and number or place the marker yourself.', 'נמצאה רק העיר. הזינו רחוב ומספר או מקמו את הסמן ידנית.'],
  ['Адрес не найден. Поставьте метку вручную: нажмите на нужное место на карте.', 'Address not found. Place the marker yourself: tap the right spot on the map.', 'הכתובת לא נמצאה. מקמו את הסמן ידנית: הקישו על המקום הנכון במפה.'],
  ['Метка поставлена вручную.', 'The marker was placed manually.', 'הסמן מוקם ידנית.'],
  ['Найти по адресу заново', 'Find by address again', 'חיפוש לפי הכתובת שוב'],
  ['Скрыть точный адрес', 'Hide the exact address', 'הסתרת הכתובת המדויקת'],
  ['На карте покажем район в радиусе около 400 м, номер дома не будет виден', 'The map will show the area within about 400 m, the house number will not be visible', 'במפה יוצג אזור ברדיוס של כ-400 מ׳, מספר הבית לא ייראה'],
  ['Адрес не найден', 'Address not found', 'הכתובת לא נמצאה'],

  // управление картой и цены на метках
  ['Ctrl + колесо мыши - изменить масштаб', 'Ctrl + scroll to zoom', 'Ctrl + גלגלת העכבר - שינוי קנה מידה'],
  ['⌘ + прокрутка - изменить масштаб', '⌘ + scroll to zoom', '⌘ + גלילה - שינוי קנה מידה'],
  ['Двигайте карту двумя пальцами', 'Use two fingers to move the map', 'הזיזו את המפה בשתי אצבעות'],
  ['Приблизить', 'Zoom in', 'הגדלה'],
  ['Отдалить', 'Zoom out', 'הקטנה'],
  ['млн', 'M', 'מיליון'],
  ['тыс.', 'K', 'אלף']
]

export const map: Record<string, { en: string, he: string }> = Object.fromEntries(rows.map(([ru, en, he]) => [ru, { en, he }]))
