# frontend

Фронтенд Kango: Nuxt 4, пакетный менеджер bun.

```bash
bun install
bun run dev      # http://localhost:3000
bun run build
```

## Иконки

SVG лежат в `app/assets/icons/`, подключены через `@nuxt/icon` как коллекция `kango`.
Имя файла: `<название>-<размер>.svg` (размер в px), логотипы соцсетей без размера.

```vue
<Icon name="kango:search-24" />
<Icon name="kango:facebook" />
```

Цвет линий и заливок иконок задаётся `currentColor` (наследуется от `color`),
логотипы Facebook и Google остаются цветными.

## Компоненты

Витрина компонентов: `/components` (`app/pages/components/index.vue`). Каждая группа
компонентов показана на своей странице `app/pages/components/<группа>.vue`, ссылка на неё
в списке появляется автоматически, как только файл создан.

Соглашения:
- компоненты дизайн-системы лежат в `app/components/ui/`, префикс `K` (`KButton`, `KTextField`);
  автоимпорт без префикса папки (`components: [{ path: '~/components', pathPrefix: false }]`);
- компоненты витрины (`ShowPage`, `ShowSection`, `ShowItem`) - в `app/components/showcase/`, в продукте не используются;
- варианты через props (`variant`, `size`, `disabled`), hover и focus через CSS, `selected` принудительно включает Hover/Selected для витрины;
- стили только на токенах из `tokens.css`, иконки через `<Icon name="kango:...">`;
- брейкпоинты из `app/utils/breakpoints.ts`, mobile-first (в media query значения 768px и 1380px пишутся числом);
- если родитель переопределяет стиль корневого элемента дочернего компонента, селектор должен быть специфичнее (`.parent .parent__child`), иначе порядок загрузки CSS ломает результат.
