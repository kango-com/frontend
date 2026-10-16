/**
 * Шапка прозрачна над обложкой только пока страница в самом верху и заливается сразу, как началась прокрутка
 * (комментарий дизайнера к «Поведение навигационной панели при скролле»).
 * Параметр обложки оставлен для совместимости вызовов; при уходе со страницы шапка снова становится залитой.
 */
export function useHeaderOverCover(_target?: Ref<HTMLElement | undefined>) {
  const solid = useState('header-solid', () => true)

  // при блокировке прокрутки (модалка, поиск) позиция страницы лежит в body.scrollTop
  const offset = () => window.scrollY || document.body.scrollTop
  const update = () => { solid.value = offset() > 1 }

  onMounted(() => {
    update()
    // scroll у body не всплывает, поэтому слушаем на фазе перехвата
    document.addEventListener('scroll', update, { passive: true, capture: true })
  })

  onBeforeUnmount(() => {
    document.removeEventListener('scroll', update, { capture: true })
    solid.value = true
  })
}
