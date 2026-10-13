# frontend

Фронтенд Kango: Nuxt 4, пакетный менеджер bun.

```bash
bun install
bun run dev      # http://localhost:3000
bun run build
bun run typecheck   # vue-tsc через nuxt typecheck
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

## Дизайн-токены

Правила дизайн-системы - в `DESIGN.md`. Токены лежат в `app/assets/css/tokens.css`
(CSS-переменные `--color-*`, `--text-*`, `--leading-*`, `--radius-*`, `--spacing-*`),
базовые стили - в `base.css`, брейкпоинты - в `app/utils/breakpoints.ts`.
Шрифт Inter подключает `@nuxt/fonts`. Превью токенов: `/tokens`, иконок: `/icons`.

## Атомарная структура

Интерфейс строится по атомарному дизайну: сначала атомы, затем молекулы, затем организмы,
затем шаблоны и страницы. Страница только компонует организмы и своей вёрстки не содержит.

```
app/components/
  atoms/       неделимые элементы: KButton, KIconButton, KTextField, KCheckbox, KTab, KBadge, KLogo ...
  molecules/   несколько атомов вместе: KSearchField, KTableRow, KAccordion, KAdCard, KCategoryCard ...
  organisms/   самостоятельные части интерфейса: KHeader, KFooter, KTabBar, KNavBar, KModalSheet, KCalendar ...
  templates/   layout-обёртки страниц (задача 0024)
  showcase/    компоненты витрины /components, в продукте не используются
app/pages/     страницы, собираются из организмов
```

Правила зависимостей (проверяет `bun run check:atomic`, скрипт `scripts/check-atomic.mjs`):
- атом не использует молекулы и организмы, молекула не использует организмы, организм не использует шаблоны;
- компонент, который нужен на нескольких уровнях, живёт на самом низком из них;
- новый компонент сразу показывается в витрине `/components` на своём уровне.

Имена: компоненты дизайн-системы с префиксом `K` (`KButton`), продуктовые организмы без префикса (`HomeHero`, `AdsFeed`).
Автоимпорт включён без префикса папки (`components: [{ path: '~/components', pathPrefix: false }]`), поэтому имя
файла и есть имя компонента, перенос между уровнями не требует правки импортов.

## Компоненты

Витрина компонентов: `/components` (`app/pages/components/index.vue`), сгруппирована по уровням атомарной структуры.
Каждая группа показана на своей странице `app/pages/components/<группа>.vue`, ссылка на неё
в списке появляется автоматически, как только файл создан.

Соглашения:
- варианты через props (`variant`, `size`, `disabled`), hover и focus через CSS, `selected` принудительно включает Hover/Selected для витрины;
- стили только на токенах из `tokens.css`, иконки через `<Icon name="kango:...">`;
- брейкпоинты из `app/utils/breakpoints.ts`, mobile-first (в media query значения 768px и 1380px пишутся числом);
- если родитель переопределяет стиль корневого элемента дочернего компонента, селектор должен быть специфичнее (`.parent .parent__child`), иначе порядок загрузки CSS ломает результат.

Проверки: `bun run typecheck`, `bun run check:atomic`, `bun run build`.
