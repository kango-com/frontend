<script setup lang="ts">
/** Вход, регистрация и восстановление пароля в одном модальном окне; экраны переключаются внутри него */
const ui = useUiStore()
const open = computed({
  get: () => ui.isOpen('login'),
  set: (v) => { if (v) ui.open('login'); else ui.close('login') }
})
const label = computed(() => ({ login: tr('Вход'), register: tr('Регистрация'), forgot: tr('Восстановление пароля') })[ui.authView])
</script>

<template>
  <KModalSheet v-model="open" :label="label" dialog panel-class="auth-modal">
    <template v-if="open">
      <KIconButton class="auth-modal__close" type="close" :label="tr('Закрыть')" @click="open = false" />
      <Transition name="auth-view" mode="out-in">
        <LoginForm v-if="ui.authView === 'login'" key="login" modal />
        <RegisterForm v-else-if="ui.authView === 'register'" key="register" modal />
        <ForgotForm v-else key="forgot" modal />
      </Transition>
    </template>
  </KModalSheet>
</template>

<!-- Окно переносится в body (Teleport), поэтому стили без scoped -->
<style>
.auth-modal { position: relative; }
.auth-modal .ksheet__body { padding: 20px 20px 28px; }
.auth-modal .auth-modal__close { position: absolute; top: 8px; right: 8px; z-index: 1; width: 40px; height: 40px; }
.auth-modal .auth-modal__close :is(svg, .iconify) { width: 28px; height: 28px; }
@media (min-width: 768px) {
  .ksheet--dialog .auth-modal { max-width: 440px; max-height: min(720px, 94dvh); border-radius: 20px; box-shadow: 0 24px 64px color-mix(in srgb, var(--color-label-primary) 28%, transparent); }
  .auth-modal .ksheet__body { padding: 28px 36px 32px; }
  .auth-modal .auth-modal__close { top: 12px; right: 12px; }
}
/* смена экрана внутри окна: короткое проявление со сдвигом, без скачка высоты */
.auth-view-enter-active { transition: opacity 0.2s var(--ease-out-strong), transform 0.2s var(--ease-out-strong); }
.auth-view-leave-active { transition: opacity 0.1s ease-out; }
.auth-view-enter-from { opacity: 0; transform: translateY(6px); }
.auth-view-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) { .auth-view-enter-active, .auth-view-leave-active { transition-duration: 0.1s; } .auth-view-enter-from { transform: none; } }
</style>
