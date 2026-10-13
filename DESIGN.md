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
  fill-gray: "#6C6C6C"
  fill-gray-2: "#D2D2D2"
  fill-gray-3: "#F2F2F2"
  fill-gray-10: "#6C6C6C1A"
  stroke-gray: "#D2D2D2"
  separator-gray: "#D2D2D2"
typography:
  sans:
    fontFamily: Inter
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
  md: 12px
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

`fill-color-4` - более тёмный оранжевый, используется для акцентного текста и активного состояния вкладок. Синие `fill-color`, `fill-color-3` и `stroke-color` - вторичные, не заменяют оранжевый как акцент.

Тёмной темы в коллекции переменных Kango нет, она не спроектирована. Переменные тёмной темы в файле принадлежат шаблонной системе и в Kango не используются. Синий `#0071DA` из PDF-гайда шаблонный, брендовым не является.

## Typography

Шрифт Inter, начертания Regular и Medium, Semi Bold и Bold только для точечного выделения (например, текст в карточке объявления и в основной кнопке). Размеры и межстрочный интервал берутся только из шкалы `typography`, где имя масштаба - размер и межстрочный интервал в px. Основной текст интерфейса - `16-16` и `17-20`, подписи и метки - `12-12` и `10-12`.

Шкала собрана по фактическому использованию в макетах "Финализация", именованных текстовых стилей Kango в Figma нет. Размер 15px используется в кнопках.

## Layout

Целевая платформа - только веб. Брейкпоинты макетов: 375px (mobile), 768px (tablet), 1380px и 1920px (desktop). Базовая сетка с модулем 4px, отступы по краям контента 16px. Если нужны колонки, то 2, 4 или 3 колонки.

Компоненты Figma (шапка, подвал, карточки, кнопки, поля) существуют в вариантах 375px, 375-768px, 768px и 1380px. Для экранов шире 1380px отдельных вариантов нет.

Типовые промежутки между элементами - 2, 4, 8 и 10px, вертикальные внутренние отступы блоков - 24px, горизонтальные - 16px.

## Shapes

Радиус `md` (12px) у карточек, полей ввода и кнопок-иконок, `sm` (4px) у мелких элементов. Основная обводка 1px серая `stroke-gray`, для выделенных блоков 1.5px. Активная обводка оранжевая 1px.

## Components

Текстовое поле: высота 44px, внутренний отступ 16px, белый фон, серая обводка 1px, текст `label-primary`. Пустое поле показывает подсказку цветом `label-secondary`.

Карточка объявления: белый фон, серая обводка 1px, радиус `md`, внутренний интервал 8px.

Кнопка-иконка: квадрат 44x44px, серая заливка с прозрачностью 10%, серая обводка 1px.

## Iconography

Иконки контурные, минималистичные, толщина линии 1.5px, цвет задаётся `currentColor`. Размеры берутся из набора `app/assets/icons/` строго по макету: 12, 16, 20, 24 и 32px, логотипы Facebook и Google остаются цветными. Иконки не масштабируются из другого размера.

## Motion

Анимация плавная и ненавязчивая: Dissolve, Move In/Out и Slide In/Out с `ease-out` и 300ms, либо без анимации. Направление закрытия обратно направлению открытия: если окно открывается снизу вверх, оно закрывается вниз, если страница появляется справа налево, возвращается слева направо.
