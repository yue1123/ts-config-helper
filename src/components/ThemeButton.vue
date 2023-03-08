<template>
  <NButton @click="handleChangeTheme" strong secondary>
    <template #icon>
      <span class="theme-icon">
        <transition
          mode="out-in"
          enter-active-class="animated_theme animate__rotateIn"
          leave-active-class="animated_theme animate__rotateOut"
        >
          <BIconMoonFill key="dark" v-if="store.isDark" />
          <BIconSunFill key="light" v-else />
        </transition>
      </span>
    </template>
  </NButton>
</template>

<script lang="ts" setup>
import { BIconSunFill, BIconMoonFill } from 'bootstrap-icons-vue'
import { NButton } from 'naive-ui'
import { ref } from 'vue'
import useStore from '../store/theme'

const store = useStore()

const emit = defineEmits(['themeChange'])

function handleChangeTheme() {
  store.isDark = !store.isDark
  emit('themeChange', store.isDark)
}
</script>

<script lang="ts">
export default {
  name: 'ThemeButton'
}
</script>
<style lang="css">
.animated_theme {
  -webkit-animation-duration: 0.6s;
  animation-duration: 0.6s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
.animate__rotateIn {
  -webkit-animation-name: rotateIn;
  animation-name: rotateIn;
  -webkit-transform-origin: center;
  transform-origin: center;
}
.animate__rotateOut {
  -webkit-animation-name: rotateOut;
  animation-name: rotateOut;
  -webkit-transform-origin: center;
  transform-origin: center;
}
@-webkit-keyframes rotateIn {
  0% {
    -webkit-transform: rotate(200deg);
    transform: rotate(200deg);
    opacity: 0;
  }

  to {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    opacity: 1;
  }
}

@keyframes rotateIn {
  0% {
    -webkit-transform: rotate(200deg);
    transform: rotate(200deg);
    opacity: 0;
  }

  to {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    opacity: 1;
  }
}

@-webkit-keyframes rotateOut {
  0% {
    opacity: 1;
  }

  to {
    -webkit-transform: rotate(200deg);
    transform: rotate(200deg);
    opacity: 0;
  }
}

@keyframes rotateOut {
  0% {
    opacity: 1;
  }

  to {
    -webkit-transform: rotate(200deg);
    transform: rotate(200deg);
    opacity: 0;
  }
}
</style>
