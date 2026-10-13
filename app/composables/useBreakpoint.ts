import { BREAKPOINTS, type Breakpoint } from '~/utils/breakpoints'

/**
 * Текущий брейкпоинт (mobile, tablet, desktop, wide). До монтирования равен `mobile`:
 * вёрстка адаптируется чистым CSS, этот composable нужен только для логики (например, число колонок в запросе).
 */
export function useBreakpoint() {
  const width = ref<number>(BREAKPOINTS.mobile)

  const current = computed<Breakpoint>(() => {
    if (width.value >= BREAKPOINTS.wide) return 'wide'
    if (width.value >= BREAKPOINTS.desktop) return 'desktop'
    if (width.value >= BREAKPOINTS.tablet) return 'tablet'
    return 'mobile'
  })

  const update = () => { width.value = window.innerWidth }
  onMounted(() => {
    update()
    window.addEventListener('resize', update, { passive: true })
  })
  onBeforeUnmount(() => {
    if (import.meta.client) window.removeEventListener('resize', update)
  })

  return {
    width,
    current,
    isMobile: computed(() => current.value === 'mobile'),
    isTablet: computed(() => current.value === 'tablet'),
    isDesktop: computed(() => current.value === 'desktop' || current.value === 'wide')
  }
}
