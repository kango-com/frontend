<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useHead({ title: () => tr('Вход - Kango') })
</script>

<template>
  <LoginForm />
</template>
