<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()

const current = computed(() => {
  const p = route.path
  if (p === '/') return 'home'
  if (p.startsWith('/map')) return 'map'
  if (p.startsWith('/new')) return 'add'
  if (p.startsWith('/favorites')) return 'favorites'
  if (['/login', '/register', '/forgot', '/reset', '/profile'].some(x => p.startsWith(x))) return 'account'
  return ''
})
</script>

<template>
  <div class="app-tabbar">
    <KTabBar :authorized="auth.isAuthed" :current="current" />
  </div>
</template>

<style scoped>
/* Нижняя навигация на 375 и 768, на desktop её нет (навигация в шапке) */
.app-tabbar { position: fixed; inset: auto 0 0; z-index: 50; }
@media (min-width: 1380px) {
  .app-tabbar { display: none; }
}
</style>
