# Карта

Своя карта без сторонних сервисов во время работы (Договор, Прил. 1, п. 9 и 11.3: OpenStreetMap, без публичных тайл-серверов OSM).
Векторные тайлы - один файл PMTiles, шрифты подписей - рядом, рисует MapLibre GL. Подход взят из проекта «Местами вкусно».

## Что где
- `public/maps/israel.pmtiles` - тайлы Израиля (OpenStreetMap, сборка Protomaps). **Не в git**: выгружается `scripts/fetch-map.sh`.
- `public/maps/fonts/<шрифт>/<диапазон>.pbf` - шрифты подписей Noto Sans из `protomaps/basemaps-assets`: латиница, кириллица, иврит (1280-1535), арабский.
- `public/maplibre/` - воркер MapLibre и RTL-плагин (`@mapbox/mapbox-gl-rtl-text@0.3.0`, правильный порядок букв в подписях на иврите и арабском).
  Копируются из `node_modules` при сборке и запуске dev-сервера (`nuxt.config.ts`, hooks), в git не хранятся.
- `app/utils/map-style.ts` - стиль карты из `@protomaps/basemaps`: цвета слоёв и язык подписей (ru / en / he по языку интерфейса).
- `app/composables/useMapLibre.ts` - загрузка MapLibre, регистрация протокола `pmtiles://` и RTL-плагина, общие настройки карты.

## Откуда берётся подложка
`app/composables/useMapLibre.ts` выбирает по порядку:
1. **Свой файл** `public/maps/israel.pmtiles` (или `NUXT_PUBLIC_MAP_TILES_URL`) - если он есть. Стиль `app/utils/map-style.ts`, шрифты свои.
2. **OpenFreeMap** (`NUXT_PUBLIC_MAP_FALLBACK_STYLE_URL`, по умолчанию `https://tiles.openfreemap.org/styles/positron`) - бесплатный публичный
   сервер векторных тайлов OSM без ключа и регистрации. Работает сразу после `bun install`, ничего скачивать не нужно: так карта
   открывается при разработке и показе заказчику. Подписи переводятся на язык интерфейса (`localizeFallbackStyle`).
3. Пустой фон с метками и пояснением - если недоступно ни то, ни другое.

Для продакшена нужен свой файл (п. 1): Договор, Прил. 1, п. 11.3 требует собственный или коммерческий тайловый сервер.
Запасную подложку в продакшене можно отключить пустым `NUXT_PUBLIC_MAP_FALLBACK_STYLE_URL`.

## Свой файл тайлов (для продакшена, по желанию - для разработки)
1. Установить pmtiles CLI: https://github.com/protomaps/go-pmtiles/releases (на Windows - `pmtiles.exe` в PATH).
2. `bash scripts/fetch-map.sh` - вся страна; `bash scripts/fetch-map.sh center` - только Гуш-Дан (быстро).
3. Обновить страницу: карта сама переключится на свой файл.

## Продакшен
1. Выгрузить файл и положить в S3/CDN с поддержкой HTTP Range (`Accept-Ranges: bytes`).
2. Для другого домена нужен CORS: `GET, HEAD`, заголовок `Range`, expose `Content-Range`, `ETag`.
3. Адрес файла - `NUXT_PUBLIC_MAP_TILES_URL`, шрифтов - `NUXT_PUBLIC_MAP_GLYPHS_URL`.
4. Обновлять файл раз в квартал-полгода достаточно для доски объявлений.

## Лицензии
Данные: © участники OpenStreetMap (ODbL), подпись на карте обязательна (задана в источнике стиля, Договор, Прил. 1, п. 11.3).
OpenFreeMap: подпись «OpenFreeMap © OpenMapTiles, данные OpenStreetMap» приходит из его TileJSON автоматически.
Protomaps basemaps - BSD-3, MapLibre GL - BSD-3, mapbox-gl-rtl-text - BSD-2, шрифты Noto Sans - SIL OFL.
