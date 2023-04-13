<template>
  <NEmpty style="--n-icon-size: auto" :description="$t('emptyTips')">
    <template #icon>
      <img src="@assets/empty.svg" alt="" :style="{ opacity: themeStore.isDark ? 0.35 : 0.5 }" />
    </template>
  </NEmpty>
</template>

<script setup lang="ts">
import { NEmpty } from 'naive-ui'
import useThemeStore from '@store/theme'
const themeStore = useThemeStore()
</script>

<style scoped></style>
