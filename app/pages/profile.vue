<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'auth' })
useHead({ title: () => tr('Профиль - Kango') })
</script>

<template>
  <ProfileView />
</template>
