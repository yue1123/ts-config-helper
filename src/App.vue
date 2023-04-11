<script lang="ts" setup>
import { onMounted, shallowRef, watchEffect } from 'vue'
import { NConfigProvider, NMessageProvider, darkTheme, lightTheme } from 'naive-ui'
import useThemeStore from '@store/theme'
import Main from '@views/Main.vue'
// import { Fireworks } from 'https://esm.run/fireworks-js'

// onMounted(() => {
//   let container = document.querySelector('#app')

//   let options = {
//     gravity: 1.4,
//     opacity: 0.4,
//     autoresize: true,
//     acceleration: 1.0
//   }

//   let fireworks = new Fireworks(container, options)

//   fireworks.start()
// })
const currentTheme = shallowRef(darkTheme)
const themeStore = useThemeStore()

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
  <NConfigProvider :theme="currentTheme">
    <NMessageProvider>
      <Main />
    </NMessageProvider>
  </NConfigProvider>
</template>
