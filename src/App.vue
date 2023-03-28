<template>
  <NConfigProvider :theme="currentTheme">
    <NMessageProvider>
      <NLayout style="height: 100vh">
        <NLayoutHeader style="position: sticky; top: 0; height: 64px; padding: 15px 24px" bordered>
          <NSpace justify="space-between" align="center">
            <NTooltip placement="right" :style="{ maxWidth: '400px' }" trigger="hover">
              <template #trigger>
                <NSpace align="end">
                  <img width="32" height="32" src="./assets/logo.png" alt="" />
                  <NH2 style="margin-bottom: 0">Config helper</NH2>
                  <span style="font-size: 12px">{{ version }}</span>
                </NSpace>
              </template>
              {{ $t('about') }}
            </NTooltip>
            <NSpace role="functional-btn" class="buttons-container">
              <NTooltip placement="bottom" trigger="hover">
                <template #trigger>
                  <NButton @click="handleExport" strong quaternary>
                    <template #icon> <BIconDownload /> </template
                  ></NButton>
                </template>
                <span>{{ $t('nav.export') }}</span>
              </NTooltip>
              <NTooltip placement="bottom" trigger="hover">
                <template #trigger>
                  <ThemeButton />
                </template>
                <span>{{ $t('nav.theme') }}</span>
              </NTooltip>
              <NTooltip placement="bottom" trigger="hover">
                <template #trigger>
                  <NButton @click="handleShowSetting" strong quaternary>
                    <template #icon> <BIconGearFill /> </template
                  ></NButton>
                </template>
                <span>{{ $t('nav.setting') }}</span>
              </NTooltip>
              <NTooltip placement="bottom" trigger="hover">
                <template #trigger>
                  <NButton
                    quaternary
                    tag="a"
                    href="https://github.com/yue1123/ts-config-helper"
                    target="_blank"
                    strong
                  >
                    <template #icon> <BIconGithub /> </template
                  ></NButton>
                </template>
                <span>{{ $t('nav.github') }}</span>
              </NTooltip>
            </NSpace>
          </NSpace>
        </NLayoutHeader>
        <Config />
      </NLayout>
      <Setting ref="setting" />
    </NMessageProvider>
  </NConfigProvider>
</template>

<script lang="ts" setup>
import { ref, shallowRef, watchEffect } from 'vue'
import {
  NConfigProvider,
  NMessageProvider,
  darkTheme,
  lightTheme,
  NH2,
  NLayout,
  NButton,
  NLayoutHeader,
  NSpace,
  NTooltip
} from 'naive-ui'
import { BIconDownload, BIconGearFill, BIconGithub } from 'bootstrap-icons-vue'
import { version } from '@package'
import ThemeButton from '@components/ThemeButton.vue'
import Config from '@views/Config.vue'
import Setting from '@views/Setting.vue'
import useStore from '@store/data'
import useThemeStore from '@store/theme'

const currentTheme = shallowRef(darkTheme)
const store = useStore()
const themeStore = useThemeStore()

function handleChangeTheme(isDark: boolean) {
  currentTheme.value = isDark ? darkTheme : lightTheme
}
watchEffect(() => handleChangeTheme(themeStore.isDark))
function handleExport() {
  if (!store.previewConfig) return
  // 创建一个新的 Blob 对象
  const blobToSave = new Blob([store.config], { type: 'application/json' })

  // 创建一个 URL 对象，以便可以将其用作下载链接
  const urlToSave = URL.createObjectURL(blobToSave)

  // 创建一个下载链接
  const downloadLink = document.createElement('a')
  downloadLink.href = urlToSave
  downloadLink.download = 'tsconfig.json'

  // 将下载链接添加到文档中并单击它以开始下载
  document.body.appendChild(downloadLink)
  downloadLink.click()

  // 释放 URL 对象以释放内存
  URL.revokeObjectURL(urlToSave)
}

// setting
const setting = ref<typeof Setting>()
function handleShowSetting() {
  setting.value?.show()
}
</script>
