<template>
  <NEmpty style="--n-icon-size: auto" :description="$t('emptyTips')">
    <template #icon>
      <img v-show="themeStore.isDark" src="@assets/b5eb2f7d6b3f8cc9b60be4a5dcf28015.svg" alt="" />
      <img
        v-show="!themeStore.isDark"
        src="@assets/02625ee29f851ec588c2020a88d82665.svg"
        alt=""
      />
    </template>
    <template #extra>
      <div class="tipText">{{ $t('about') }}</div>
    </template>
  </NEmpty>
</template>

<script setup lang="ts">
import { NEmpty } from 'naive-ui'
import useThemeStore from '@store/theme'
const themeStore = useThemeStore()
</script>

<style scoped></style>
