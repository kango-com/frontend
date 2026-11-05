<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: () => tr('Мой профиль - Kango') })
</script>

<template>
  <ProfileEditForm />
</template>
