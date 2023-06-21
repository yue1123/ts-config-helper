<script lang="ts" setup>
import { computed, shallowRef, watchEffect } from 'vue'
import {
  NConfigProvider,
  NMessageProvider,
  darkTheme,
  lightTheme,
  type GlobalThemeOverrides
} from 'naive-ui'
import useThemeStore from '@stores/theme'
import Main from '@views/Main.vue'

const themeStore = useThemeStore()
const overrideDarkTheme = computed<GlobalThemeOverrides>(() => {
  const bg = themeStore.isDark ? '#101010' : '#fff'
  return {
    common: {
      bodyColor: bg
    },
    Layout: {
      headerColor: bg
    }
  }
})

const currentTheme = shallowRef(darkTheme)

watchEffect(() => {
  currentTheme.value = themeStore.isDark ? darkTheme : lightTheme
  const root = document.querySelector('html')
  if (root) {
    root.classList.toggle('dark', themeStore.isDark)
    root.classList.toggle('light', !themeStore.isDark)
  }
})
</script>

<template>
  <NConfigProvider :theme="currentTheme" :theme-overrides="overrideDarkTheme">
    <NMessageProvider>
      <Main />
    </NMessageProvider>
  </NConfigProvider>
</template>
