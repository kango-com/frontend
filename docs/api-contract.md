# Контракт API Kango

Единый контракт для мока (MSW в браузере, `app/mocks/`) и будущего бэкенда. Клиент: `app/api/`, типы: `app/types/`.
Базовый адрес `NUXT_PUBLIC_API_BASE` (по умолчанию `/api`). Все ответы JSON, даты в ISO 8601, деньги в шекелях (`ILS`).

## Общее
- **Авторизация:** заголовок `Authorization: Bearer <token>`. Токен приходит из `login`, `register`, `social`, хранится в cookie `kango_token`.
- **Ошибка:** HTTP-статус 4xx/5xx и тело `{ "code": "validation", "message": "Заполните поля", "fields": { "email": "Введите e-mail" } }`. Клиент приводит любую ошибку к `ApiError` (`app/types/common.ts`).
  Коды: `network` (клиент), `aborted` (клиент), `unauthorized` (401), `forbidden` (403), `not_found` (404), `validation` (422), `conflict` (409), `server` (5xx).
- **Пагинация:** `page` (с 1), `limit` (по умолчанию 24, максимум 60). Ответ `Pagination<T> { items, total, page, limit, hasMore }`.
- **Города:** `city` и `cityIds` это список id через запятую; пусто означает «Весь Израиль».
- **Фильтр:** передаётся одним JSON-параметром `f` (`FilterState`, `app/types/filters.ts`); сортировка `sort`: `default`, `date`, `cheaper`, `expensive`, `distance`, `salary-desc`, `salary-asc`.

## Авторизация
| Метод и путь | Запрос | Ответ | Ошибки |
|---|---|---|---|
| `POST /auth/login` | `{ email, password }` | `{ user, token }` | 422 `fields`, 401 `unauthorized` |
| `POST /auth/register` | `{ name, email, password }` | `{ user, token }` | 422, 409 (e-mail занят) |
| `POST /auth/social` | `{ provider: google \| facebook }` | `{ user, token }` | |
| `POST /auth/logout` | | 204 | |
| `GET /auth/me` | | `User` | 401 |
| `POST /auth/forgot` | `{ email }` | `{ sent: true, devLink? }` | 422 |
| `GET /auth/reset/validate?token=` | | `{ valid }` | |
| `POST /auth/reset` | `{ token, password }` | `{ ok: true }` | 410 `expired` (ссылка устарела), 422 |

## Города и разделы
| Метод и путь | Параметры | Ответ |
|---|---|---|
| `GET /cities` | `q`, `limit` | `City[]` (поиск по подстроке) |
| `GET /cities/popular` | | `City[]` (чипы на главной) |
| `GET /districts` | `cityIds` | `District[]` |
| `GET /streets` | `cityIds`, `districtIds`, `q` | `RefItem[]` |
| `GET /sections` | `city` | `SectionInfo[]` (раздел и количество объявлений) |

## Объявления
| Метод и путь | Параметры | Ответ |
|---|---|---|
| `GET /ads` | `section`, `q`, `city`, `sort`, `page`, `limit`, `f` | `Pagination<AdCard>` |
| `GET /ads/recommendations` | `city`, `page`, `limit` | `Pagination<AdCard>` |
| `GET /ads/:id` | | `Ad` (404 `not_found`) |
| `GET /me/ads` | | `AdCard[]` (нужен вход) |
| `POST /ads` | `AdDraft` | `{ id }` (нужен вход, 422 с `fields`) |
| `PATCH /ads/:id`, `DELETE /ads/:id` | | `Ad`, 204 (только автор) |
| `POST /ads/:id/report` | `{ reason, comment? }` | 204 |
| `POST /ads/describe` | `{ section, data }` | `{ description }` |
| `POST /uploads` | multipart `file` | `{ url }` |
| `GET /filters/count` | `section`, `q`, `f` | `{ count }` |

## Справочники (`GET /references/...`)
`work/categories`, `work/positions?categoryId`, `realty/categories`, `realty/types?category`, `realty/subtypes?type`, `realty/projects?cityIds`, `realty/developers?projectIds`, `goods/categories`, `goods/subcategories?categoryId`, `goods/brands?subcategoryId&categoryId`, `goods/models?brandIds`, `services/categories`, `services/subcategories?categoryId`. Ответ везде `RefItem[]` (`id`, `title`, `parentId?`).

## Поиск
| Метод и путь | Запрос | Ответ |
|---|---|---|
| `GET /search/suggest?q=` | | `SearchSuggestion[]` (по префиксу, с категорией) |
| `GET /search/popular` | | `SearchSuggestion[]` (популярные запросы для пустого поля) |
| `GET /search/history` | | `SearchHistoryItem[]` (нужен вход, иначе пусто) |
| `POST /search/history` | `{ text, categoryTitle? }` | `SearchHistoryItem` |
| `DELETE /search/history/:id`, `DELETE /search/history` | | 204 |

## Избранное и просмотренные (нужен вход, иначе 401)
`GET /favorites` (`AdCard[]`), `PUT /favorites/:adId`, `DELETE /favorites/:adId`, `GET /me/viewed` (`AdCard[]`), `POST /me/viewed/:adId`.

## Платежи
| Метод и путь | Запрос | Ответ |
|---|---|---|
| `GET /promo-packages` | | `PromoPackage[]` (Поднять 49, Выделить 79, Максимум 99) |
| `POST /payments` | `{ adId, packageId, returnUrl }` | `PaymentSession { id, redirectUrl }` |
| `GET /payments/:id` | | `PaymentStatus` |
| `POST /payments/:id/confirm` | `{ result }` | `PaymentStatus` (только мок, имитация провайдера) |

## Контент
`GET /documents` (`DocumentInfo[]`), `GET /documents/:slug` (`DocumentFull`), `POST /feedback` (multipart: `name`, `email`, `message`, `attachment?`, ответ 204).
