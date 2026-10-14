<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'auth' })
useHead({ title: 'Профиль - Kango' })
</script>

<template>
  <ProfileView />
</template>
