---
version: alpha
name: Kango
description: Дизайн-система Kango, доски объявлений для русскоязычных жителей Израиля. Источник - файл Figma "UX/UI Доска объявлений" (переменные коллекции Kango, страницы "Финализация 1 и 2", "Дизайн система").
colors:
  fill-primary: "#FD4A00"
  stroke-primary: "#FD4A00"
  fill-color-4: "#C73A00"
  fill-color: "#3E8EFA"
  fill-color-3: "#005CFE"
  stroke-color: "#005CFE"
  label-primary: "#0E0F11"
  label-secondary: "#686868"
  label-gray: "#ACACAC"
  label-white: "#FFFFFF"
  background: "#FFFFFF"
  fill-white: "#FFFFFF"
  fill-disabled: "#FFC9B3"
  fill-error: "#FF2A2A"
  label-disabled: "#FF966C"
  fill-color-disabled: "#D7E6F5"
  label-color-disabled: "#8AC4FF"
  fill-gray-4: "#F9F9F9"
  label-gray-2: "#ABABAC"
  fill-tint: "#EBF4FB"
  fill-gray: "#6C6C6C"
  fill-gray-2: "#D2D2D2"
  fill-gray-3: "#F2F2F2"
  fill-gray-10: "#6C6C6C1A"
  stroke-gray: "#D2D2D2"
  separator-gray: "#D2D2D2"
typography:
  sans:
    fontFamily: Inter
  sans-tight:
    fontFamily: Inter Tight
  28-28:
    fontFamily: Inter
    fontSize: 28px
    lineHeight: 28px
  22-24:
    fontFamily: Inter
    fontSize: 22px
    lineHeight: 24px
  20-20:
    fontFamily: Inter
    fontSize: 20px
    lineHeight: 20px
  17-20:
    fontFamily: Inter
    fontSize: 17px
    lineHeight: 20px
  16-20:
    fontFamily: Inter
    fontSize: 16px
    lineHeight: 20px
  16-16:
    fontFamily: Inter
    fontSize: 16px
    lineHeight: 16px
  15-16:
    fontFamily: Inter
    fontSize: 15px
    lineHeight: 16px
  14-16:
    fontFamily: Inter
    fontSize: 14px
    lineHeight: 16px
  13-16:
    fontFamily: Inter
    fontSize: 13px
    lineHeight: 16px
  12-16:
    fontFamily: Inter
    fontSize: 12px
    lineHeight: 16px
  12-12:
    fontFamily: Inter
    fontSize: 12px
    lineHeight: 12px
  10-12:
    fontFamily: Inter
    fontSize: 10px
    lineHeight: 12px
rounded:
  sm: 4px
  tab: 8px
  md: 12px
  pill: 9999px
spacing:
  unit: 4px
  gutter: 16px
components:
  text-field:
    backgroundColor: "{colors.background}"
    textColor: "{colors.label-primary}"
    typography: "{typography.16-16}"
    rounded: "{rounded.md}"
    height: 44px
    padding: 16px
  text-field-placeholder:
    textColor: "{colors.label-secondary}"
    typography: "{typography.16-16}"
  card:
    backgroundColor: "{colors.background}"
    textColor: "{colors.label-primary}"
    rounded: "{rounded.md}"
  icon-button:
    backgroundColor: "{colors.fill-gray-10}"
    rounded: "{rounded.md}"
    height: 44px
    width: 44px
---

## Overview

Kango - веб-платформа объявлений (работа, жильё, мастера) для русскоязычных жителей Израиля. Принципы дизайн-системы: минимализм в деталях, удобство взаимодействия, привычные паттерны, эстетичный дизайн. Интерфейс простой и узнаваемый, пользователь не должен искать меню или базовые функции.

Стиль задают контурные поля и кнопки, минималистичные контурные иконки, шрифт Inter, строгая палитра из чёрного, белого, серого и одного фирменного акцента. Маскот-кенгуру - символ бренда.

## Colors

Фирменный и единственный акцентный цвет - оранжевый `fill-primary` (он же `stroke-primary` для активной обводки). Остальная палитра нейтральная: текст `label-primary`, второстепенный текст `label-secondary`, неактивный и подсказки `label-gray`, фон страниц `background`, подложки полей и блоков `fill-gray-3`, обводки и разделители серые (`stroke-gray`, `separator-gray`).

`fill-disabled` - светлый оранжевый для отключённых элементов (Primary button, Switch, трек Slider). `label-disabled` - текст на отключённой Primary button. `fill-color-disabled` и `label-color-disabled` - отключённые Secondary и Outline (заливка/обводка и текст/иконка). `fill-gray-4` и `label-gray-2` - отключённая Neutral button. `fill-tint` - светлая подложка слота картинки в Filter Tab.

`fill-error` - красный, в макетах используется в иконках и состояниях ошибки, роль предположительная (в Figma имя переменной не подтверждено).

`fill-color-4` - более тёмный оранжевый, используется для акцентного текста и активного состояния вкладок. Синие `fill-color`, `fill-color-3` и `stroke-color` - вторичные, не заменяют оранжевый как акцент.

Тёмной темы в коллекции переменных Kango нет, она не спроектирована. Переменные тёмной темы в файле принадлежат шаблонной системе и в Kango не используются. Синий `#0071DA` из PDF-гайда шаблонный, брендовым не является.

## Typography

Шрифт Inter, начертания Regular и Medium, Semi Bold только для точечного выделения (например, текст в карточке объявления, подзаголовки). Размеры и межстрочный интервал берутся только из шкалы `typography`, где имя масштаба - размер и межстрочный интервал в px. Основной текст интерфейса - `16-16` и `17-20`, подписи и метки - `12-12`, `12-16` и `10-12`.

Вторичный шрифт Inter Tight (`sans-tight`) используется в стилях диапазона 375-768px (Title 1 34/36, Title 2 24/24 и др.) и в мелком тексте макетов (11/12, 12/12, 16/16). Для остального везде Inter.

В Figma есть именованные текстовые стили (56 штук, страница "Дизайн система"), например `375px (Mobile)/Body 1/Medium` = Inter Medium 17/20, `1380px (Desktop)/Title 5 - Medium` = Inter Medium 16/16. Шкала `typography` собрана из них и из фактического использования в макетах "Финализация". Размеры `28-28` (Medium), `22-24` (Medium) и `20-20` (Regular и Semi Bold) в страницу "Дизайн система" не входят, они найдены только в "Финализации". Размер 15px используется в кнопках Secondary и Outline, 17/20 - в Primary button.

## Layout

Целевая платформа - только веб. Брейкпоинты макетов: 375px (mobile), 768px (tablet), 1380px и 1920px (desktop). Базовая сетка с модулем 4px, отступы по краям контента 16px. Если нужны колонки, то 2, 4 или 3 колонки.

Компоненты Figma (шапка, подвал, карточки, кнопки, поля) существуют в вариантах 375px, 375-768px, 768px и 1380px. Для экранов шире 1380px отдельных вариантов нет.

Типовые промежутки между элементами - 2, 4, 8 и 10px, внутренние отступы компонентов - 8, 10, 12, 16 и 20px (кнопки 16/12, чипы и карточки 8, Icon button 10, Modal Sheet 16/20), отступ по краям контента 16px.

## Shapes

Радиус `md` (12px) у карточек, полей ввода, кнопок и кнопок-иконок, `tab` (8px) у вкладок и favicon, `sm` (4px) у чекбокса и мелких элементов, `pill` у чипов городов. Основная обводка 1px серая `stroke-gray`, обводка иконок и контуров полей 1.5px `fill-gray`. Активная обводка оранжевая (1px у карточек и чипов, 1.5px у полей и Icon button). Обводка Plain-кнопок, чипов и Ad Card в Figma синяя `fill-color` 1px.

## Components

Текстовое поле: высота 44px, внутренний отступ 16px, белый фон, серая обводка 1px, текст `label-primary`. Пустое поле показывает подсказку цветом `label-secondary`.

Карточка объявления: белый фон, серая обводка 1px, радиус `md`, внутренний интервал 8px.

Кнопка-иконка: квадрат 44x44px, серая заливка с прозрачностью 10%, серая обводка 1px.

Кнопки: высота 44px (на 1380px - 52px), радиус `md`, внутренний отступ 16/12. Primary - заливка `fill-primary`, белый текст Medium 17/20, отключённая `fill-disabled`. Secondary - заливка и обводка `fill-color-3`, белый текст Medium 15/16. Outline - обводка `fill-color-3` 1px, текст `label-primary` Medium 15/16. Neutral - заливка `fill-gray-3`, Medium 15/16. Состояния: Default, Hover/Selected, Disabled.

## Iconography

Иконки контурные, минималистичные, толщина линии 1.5px, цвет задаётся `currentColor`. Размеры берутся из набора `app/assets/icons/` строго по макету: 12, 16, 20, 24 и 32px, логотипы Facebook и Google остаются цветными (в Figma они есть на 28, 32 и 44px, в коде пока только 44px). В наборе Figma ещё нет в коде: 24px `Cancel` (серый крест, возможно дубль `Close`), 20px `Indicator` (бейдж со счётчиком, делается компонентом) и 44px `Default` (пустая оранжевая рамка, назначение неизвестно). Иконки не масштабируются из другого размера.

## Motion

Анимация плавная и ненавязчивая: Dissolve, Move In/Out и Slide In/Out с `ease-out` и 300ms, либо без анимации. Направление закрытия обратно направлению открытия: если окно открывается снизу вверх, оно закрывается вниз, если страница появляется справа налево, возвращается слева направо.
