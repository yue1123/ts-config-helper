<template>
  <NEmpty style="--n-icon-size: auto" :description="$t('emptyTips')">
    <template #icon>
      <img src="@assets/empty.svg" alt="" style="opacity: 0.3" />
      <!-- v-show="themeStore.isDark" -->
      <!-- <img
        v-show="!themeStore.isDark"
        src="@assets/02625ee29f851ec588c2020a88d82665.svg"
        alt=""
      /> -->
    </template>
    <template #extra>
      <!-- <div class="tipText">{{ $t('about') }}</div> -->
    </template>
  </NEmpty>
</template>

<script setup lang="ts">
import { NEmpty } from 'naive-ui'
import useThemeStore from '@store/theme'
const themeStore = useThemeStore()
</script>

<style scoped></style>
