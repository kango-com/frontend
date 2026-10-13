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

Соглашения (задача 0006, предварительные, подтверждаются при реализации первых компонентов):
- компоненты в `app/components/ui/`, префикс `K` (`KButton`, `KTextField`);
- варианты через props (`variant`, `size`, `disabled`), hover и focus через CSS;
- стили только на токенах из `tokens.css`, иконки через `<Icon name="kango:...">`;
- брейкпоинты из `app/utils/breakpoints.ts`, mobile-first.
