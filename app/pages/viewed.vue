<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: () => tr('Просмотренные - Kango') })
// у гостя просмотренные без кабинета, у вошедшего - раздел кабинета с боковым меню
const auth = useAuthStore()
</script>

<template>
  <CabinetShell :enabled="auth.isAuthed">
    <SavedAds kind="viewed" />
  </CabinetShell>
</template>
