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
