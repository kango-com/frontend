/**
 * Шапка прозрачна над обложкой и заливается после того, как обложка прокручена
 * (комментарий дизайнера к «Поведение навигационной панели при скролле»).
 * Передайте элемент обложки; при уходе со страницы шапка снова становится залитой.
 */
export function useHeaderOverCover(target: Ref<HTMLElement | undefined>) {
  const solid = useState('header-solid', () => true)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    solid.value = false
    const header = document.querySelector('.app-header')?.getBoundingClientRect().height ?? 50
    observer = new IntersectionObserver(([entry]) => { solid.value = !entry?.isIntersecting }, {
      rootMargin: `-${Math.round(header)}px 0px 0px 0px`,
      threshold: 0
    })
    if (target.value) observer.observe(target.value)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    solid.value = true
  })
}
