<script setup lang="ts">
// Одна страница для списка (/messages) и диалога (/messages/:id): экран не пересоздаётся при выборе диалога
definePageMeta({ layout: 'default', middleware: 'auth', key: 'messages' })
useHead({ title: () => tr('Сообщения - Kango') })

const route = useRoute()
const router = useRouter()
const chat = useChatStore()
const id = computed(() => (typeof route.params.id === 'string' && route.params.id ? route.params.id : undefined))
const openError = ref('')

// «Написать в чат» со страницы объявления: /messages?ad=<id> - открываем или создаём диалог
async function openFromAd() {
  const adId = typeof route.query.ad === 'string' ? route.query.ad : ''
  if (!adId || id.value) return
  openError.value = ''
  const r = await chat.openForAd(adId)
  if ('id' in r) await router.replace(`/messages/${r.id}`)
  else openError.value = r.error
}
onMounted(openFromAd)
watch(() => route.query.ad, openFromAd)
</script>

<template>
  <CabinetShell>
    <p v-if="openError" class="msg__error" role="alert">{{ openError }}</p>
    <ChatView :dialog-id="id" />
  </CabinetShell>
</template>

<style scoped>
.msg__error { margin: 0 0 12px; padding: 10px 14px; border-radius: var(--radius-md); background: color-mix(in srgb, var(--color-fill-error) 8%, transparent); font-size: var(--text-14-16); }
</style>
