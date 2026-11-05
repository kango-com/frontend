<script setup lang="ts">
import { CABINET_LINKS } from '~/utils/cabinet'

/** Оболочка кабинета: на 1380+ боковое меню с пользователем и выходом, справа страница; ниже только страница.
 *  `enabled = false` (гость на /favorites) - только содержимое, без оболочки */
const props = withDefaults(defineProps<{ enabled?: boolean }>(), { enabled: true })
const auth = useAuthStore()
const mine = useMyAdsStore()
const favorites = useFavoritesStore()
const purchases = usePurchasesStore()
const chat = useChatStore()
const router = useRouter()

if (props.enabled) provideInCabinet()

onMounted(() => {
  if (!props.enabled) return
  if (mine.status === 'idle') mine.load()
  if (!favorites.items.length) favorites.load()
  if (purchases.status === 'idle') purchases.load()
})

const counts = computed(() => ({
  ads: mine.items.length,
  favorites: favorites.items.length,
  services: purchases.active.length,
  messages: chat.unreadTotal
}))

async function logout() {
  await auth.logout()
  mine.reset()
  purchases.reset()
  favorites.clear()
  await router.push('/')
}

defineExpose({ logout })
</script>

<template>
  <KContainer v-if="enabled" class="cab">
    <aside class="cab__side" :aria-label="tr('Кабинет')">
      <NuxtLink v-if="auth.user" to="/profile" class="cab__user">
        <UserAvatar :name="auth.user.name" :src="auth.user.avatarUrl" :size="48" />
        <span class="cab__who">
          <span class="cab__name">{{ auth.user.name }}</span>
          <span class="cab__mail">{{ auth.user.email }}</span>
        </span>
      </NuxtLink>
      <CabinetNav :links="CABINET_LINKS" :counts="counts" variant="sidebar" />
      <KButton variant="plain" size="sm" class="cab__logout" @click="logout">{{ tr('Выйти') }}</KButton>
    </aside>
    <div class="cab__main">
      <slot :counts="counts" :logout="logout" />
    </div>
  </KContainer>
  <slot v-else />
</template>

<style scoped>
.cab { padding-block: 8px 40px; }
.cab__side { display: none; }
.cab__main { min-width: 0; }
@media (min-width: 768px) {
  .cab { padding-block: 16px 48px; }
}
@media (min-width: 1380px) {
  .cab { display: grid; grid-template-columns: 280px minmax(0, 1fr); align-items: start; gap: 40px; padding-block: 32px 64px; }
  .cab__side { position: sticky; top: calc(var(--header-h) + 24px); display: flex; flex-direction: column; gap: 16px; padding: 16px 12px; border: var(--border-width) solid var(--color-stroke-gray); border-radius: var(--radius-md); }
  .cab .cab__user { display: flex; align-items: center; gap: 12px; padding: 4px 4px 16px; border-bottom: var(--border-width) solid var(--color-separator-gray); color: inherit; text-decoration: none; }
  .cab__user:focus-visible { outline: var(--border-width-strong) solid var(--color-stroke-primary); outline-offset: 2px; border-radius: var(--radius-sm); }
  .cab__who { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .cab__name { font-size: var(--text-16-20); line-height: var(--leading-16-20); font-weight: var(--font-weight-medium); overflow-wrap: anywhere; }
  .cab__mail { color: var(--color-label-secondary); font-size: var(--text-13-16); line-height: var(--leading-13-16); overflow-wrap: anywhere; }
  .cab .cab__logout { align-self: flex-start; margin-inline-start: 4px; }
}
@media (min-width: 1920px) {
  .cab { grid-template-columns: 300px minmax(0, 1fr); gap: 56px; }
}
</style>
