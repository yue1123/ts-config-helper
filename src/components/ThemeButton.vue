<template>
  <NButton text @click="handleChangeTheme">
    <template #icon>
      <span class="theme-icon" style="--animation-time: 0.6s">
        <transition
          mode="out-in"
          enter-active-class="animated animate__rotateIn"
          leave-active-class="animated animate__rotateOut"
        >
          <BIconMoonFill key="dark" v-if="store.isDark" />
          <BIconSunFill key="light" v-else />
        </transition>
      </span>
    </template>
  </NButton>
</template>

<script lang="ts" setup>
import { BIconMoonFill, BIconSunFill } from 'bootstrap-icons-vue'
import { NButton } from 'naive-ui'
import useStore from '../stores/theme'

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
