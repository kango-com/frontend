// Брейкпоинты макетов Kango (mobile-first). Источник: DESIGN.md, раздел Layout.
export const BREAKPOINTS = {
  mobile: 375,
  tablet: 768,
  desktop: 1380,
  wide: 1920
} as const

export type Breakpoint = keyof typeof BREAKPOINTS
