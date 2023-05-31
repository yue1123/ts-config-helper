<template>
  <NEmpty style="--n-icon-size: auto" :description="$t('emptyTips')">
    <template #icon>
      <img
        class="select-none select"
        src="@assets/empty.svg"
        alt=""
        :style="{ opacity: themeStore.isDark ? 0.35 : 0.5 }"
      />
    </template>
  </NEmpty>
</template>

<script setup lang="ts">
import { NEmpty } from 'naive-ui'
import useThemeStore from '@stores/theme'
const themeStore = useThemeStore()
</script>

<style scoped>
img {
  -webkit-user-drag: none;
  -moz-user-drag: none;
  -ms-user-drag: none;
  user-drag: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
