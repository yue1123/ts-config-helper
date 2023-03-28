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
              <NTooltip v-if="isSupported" placement="bottom" trigger="hover">
                <template #trigger>
                  <NButton @click="handleCopy" strong quaternary>
                    <template #icon>
                      <BIconClipboardFill v-if="!copied" />
                      <BIconClipboardCheckFill v-else /> </template
                  ></NButton>
                </template>
                <span v-if="!copied">{{ $t('nav.copyToClipboard') }}</span>
                <span v-else>{{ $t('nav.copied') }}</span>
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
import { getCurrentInstance, ref, shallowRef, watchEffect } from 'vue'
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
  NTooltip,
  useMessage
} from 'naive-ui'
import {
  BIconClipboardFill,
  BIconClipboardCheckFill,
  BIconGearFill,
  BIconGithub
} from 'bootstrap-icons-vue'
import { useClipboard } from '@vueuse/core'
import { version } from '@package'
import ThemeButton from '@components/ThemeButton.vue'
import Config from '@views/Config.vue'
import Setting from '@views/Setting.vue'
import useStore from '@store/data'
import useThemeStore from '@store/theme'

const currentTheme = shallowRef(darkTheme)
const store = useStore()
const themeStore = useThemeStore()
const { copy, copied, isSupported } = useClipboard()

function handleChangeTheme(isDark: boolean) {
  currentTheme.value = isDark ? darkTheme : lightTheme
}
watchEffect(() => handleChangeTheme(themeStore.isDark))
function handleCopy() {
  copy(store.config)
}

// setting
const setting = ref<typeof Setting>()
function handleShowSetting() {
  setting.value?.show()
}
</script>
