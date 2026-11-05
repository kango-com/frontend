<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'auth' })
useHead({ title: () => tr('Избранное - Kango') })
const auth = useAuthStore()
</script>

<template>
  <CabinetShell :enabled="auth.isAuthed">
    <SavedAds kind="favorites" />
  </CabinetShell>
</template>
