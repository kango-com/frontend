// Начальная загрузка: восстанавливаем сессию по токену из cookie (после запуска мока и Pinia)
export default defineNuxtPlugin(async () => {
  await useAuthStore().fetchMe()
})
