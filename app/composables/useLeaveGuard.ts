/** Предупреждает об уходе со страницы с несохранёнными данными (переход внутри приложения и закрытие вкладки) */
export function useLeaveGuard(dirty: Ref<boolean> | ComputedRef<boolean>, message = 'Изменения не сохранены. Уйти со страницы?') {
  onBeforeRouteLeave(() => (dirty.value && !window.confirm(message) ? false : undefined))

  const beforeUnload = (e: BeforeUnloadEvent) => {
    if (dirty.value) { e.preventDefault(); e.returnValue = '' }
  }
  onMounted(() => window.addEventListener('beforeunload', beforeUnload))
  onBeforeUnmount(() => window.removeEventListener('beforeunload', beforeUnload))
}
