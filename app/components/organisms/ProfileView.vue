<script setup lang="ts">
import { formatPrice, formatPublished } from '~/utils/format'
import { formatSince } from '~/utils/ad-view'

/** Профиль: данные пользователя, быстрые ссылки, «Мои объявления» (продвинуть, удалить), выход */
const auth = useAuthStore()
const mine = useMyAdsStore()
const favorites = useFavoritesStore()
const router = useRouter()

onMounted(() => { mine.load(); favorites.load() })

const toDelete = ref<string | null>(null)
const failed = ref('')

async function confirmRemove() {
  const id = toDelete.value
  toDelete.value = null
  failed.value = ''
  if (id && !(await mine.remove(id))) failed.value = tr('Не удалось удалить объявление. Попробуйте ещё раз.')
}

// продвижение существующего объявления не трогает черновик подачи: id уходит в адрес страницы
const promote = (id: string) => router.push({ path: '/new/promote', query: { ad: id } })

async function logout() {
  await auth.logout()
  mine.reset()
  favorites.clear()
  await router.push('/')
}

const initial = computed(() => auth.user?.name?.trim().charAt(0).toUpperCase() ?? '?')
</script>

<template>
  <KContainer as="section" class="prof" aria-labelledby="prof-title">
    <h1 id="prof-title" class="visually-hidden">{{ tr('Профиль') }}</h1>

    <div v-if="auth.user" class="prof__head">
      <span class="prof__avatar" aria-hidden="true">{{ initial }}</span>
      <div class="prof__who">
        <span class="prof__name">{{ auth.user.name }}</span>
        <span class="prof__mail">{{ auth.user.email }}</span>
        <span class="prof__since">{{ tr('На сервисе с') }} {{ formatSince(auth.user.createdAt) }}</span>
      </div>
    </div>

    <nav class="prof__menu" :aria-label="tr('Разделы профиля')">
      <KTableRow type="chevron" :label="tr('Избранное')" :description="favorites.items.length ? tr('{n} объявл.', { n: favorites.items.length }) : undefined" to="/favorites" />
      <KTableRow type="chevron" :label="tr('Просмотренные')" to="/viewed" />
      <KTableRow type="chevron" :label="tr('Подать объявление')" to="/new" />
    </nav>

    <section class="prof__ads" aria-labelledby="prof-ads">
      <h2 id="prof-ads" class="prof__h2">{{ tr('Мои объявления') }}</h2>
      <p v-if="failed" class="prof__error" role="alert">{{ failed }}</p>

      <ul v-if="mine.items.length" class="prof__list">
        <li v-for="ad in mine.items" :key="ad.id">
          <MyAdCard
            :title="ad.title"
            :price="formatPrice(ad.price)"
            :location="ad.location"
            :image="ad.image"
            :published="formatPublished(ad.createdAt)"
            :promoted="ad.promoted"
            :to="`/ad/${ad.id}`"
            @promote="promote(ad.id)"
            @remove="toDelete = ad.id"
          />
        </li>
      </ul>
      <p v-else-if="mine.status === 'loading'" class="prof__note" aria-busy="true">{{ tr('Загрузка...') }}</p>
      <p v-else-if="mine.status === 'error'" class="prof__note" role="alert">
        {{ tr('Не удалось загрузить объявления.') }} <KTextButton size="sm" @click="mine.load()">{{ tr('Повторить') }}</KTextButton>
      </p>
      <div v-else class="prof__empty">
        <p>{{ tr('У вас пока нет объявлений.') }}</p>
        <KButton to="/new">{{ tr('Подать объявление') }}</KButton>
      </div>
    </section>

    <KButton variant="neutral" class="prof__logout" @click="logout">{{ tr('Выйти') }}</KButton>

    <KModalSheet :model-value="!!toDelete" :title="tr('Удалить объявление?')" dialog @update:model-value="v => { if (!v) { toDelete = null; failed = '' } }">
      <div class="prof__confirm">
        <p>{{ tr('Объявление исчезнет из поиска и ленты. Это действие нельзя отменить.') }}</p>
        <KButton block @click="confirmRemove">{{ tr('Удалить') }}</KButton>
        <KButton block variant="outline" @click="toDelete = null">{{ tr('Отмена') }}</KButton>
      </div>
    </KModalSheet>
  </KContainer>
</template>

<style scoped>
.prof { display: flex; flex-direction: column; gap: 20px; padding-block: 16px 40px; }
.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.prof__head { display: flex; align-items: center; gap: 16px; }
.prof__avatar { display: inline-flex; flex: none; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: 50%; background: var(--color-fill-primary); color: var(--color-label-white); font-size: 28px; font-weight: var(--font-weight-medium); }
.prof__who { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.prof__name { font-size: var(--text-20-20); line-height: var(--leading-20-20); font-weight: var(--font-weight-medium); overflow-wrap: anywhere; }
.prof__mail, .prof__since { color: var(--color-label-secondary); font-size: var(--text-14-16); line-height: var(--leading-14-16); overflow-wrap: anywhere; }
.prof__menu { border-block: var(--border-width) solid var(--color-stroke-gray); }
.prof__ads { display: flex; flex-direction: column; gap: 12px; }
.prof__h2 { margin: 0; font-size: var(--text-20-20); line-height: var(--leading-20-20); font-weight: var(--font-weight-medium); }
.prof__list { display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px; margin: 0; padding: 0; list-style: none; }
.prof__note, .prof__empty p { margin: 0; color: var(--color-label-secondary); }
.prof__empty { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
.prof__error { margin: 0; color: var(--color-fill-error); font-size: var(--text-14-16); }
.prof .prof__logout { align-self: flex-start; min-width: 160px; }
.prof__confirm { display: flex; flex-direction: column; gap: 8px; }
.prof__confirm p { margin: 0 0 8px; color: var(--color-label-secondary); }
@media (min-width: 768px) {
  .prof__list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (min-width: 1380px) {
  .prof { padding-block: 32px 64px; }
  .prof__list { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
</style>
