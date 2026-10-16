/**
 * Блокировка прокрутки страницы без исчезновения скроллбара окна: полоса остаётся (пустая), вёрстка не сдвигается.
 * html держит скроллбар, body становится окном высотой в экран, позиция страницы переносится в body.scrollTop.
 * Счётчик позволяет нескольким слоям (модалка, поиск) блокировать страницу одновременно.
 */
let locks = 0
let savedScroll = 0

export function lockScroll() {
  if (!import.meta.client) return
  if (locks++ > 0) return
  const html = document.documentElement
  const body = document.body
  savedScroll = window.scrollY
  html.style.overflowY = 'scroll'
  body.style.height = '100dvh'
  body.style.overflow = 'hidden'
  body.scrollTop = savedScroll
}

export function unlockScroll() {
  if (!import.meta.client || locks === 0) return
  if (--locks > 0) return
  const html = document.documentElement
  const body = document.body
  const y = body.scrollTop || savedScroll
  html.style.overflowY = ''
  body.style.height = ''
  body.style.overflow = ''
  window.scrollTo(0, y)
}
