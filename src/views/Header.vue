<script lang="ts" setup>
import { NButton, NLayoutHeader, NSpace, NTooltip, NSelect } from 'naive-ui'
import { computed, ref } from 'vue'

import ThemeButton from '@components/ThemeButton.vue'
import useStore from '@store/data'
import useThemeStore from '@store/theme'
import Setting from '@views/Setting.vue'
import { useClipboard } from '@vueuse/core'
import { BIconClipboardCheck, BIconClipboard, BIconGear, BIconGithub } from 'bootstrap-icons-vue'
import Version from '@components/Version.vue'
import darkLogo from '../assets/logo.png'
import lightLogo from '../assets/logo-light.png'
const store = useStore()
const { copy, copied, isSupported } = useClipboard()
const themeStore = useThemeStore()

function handleCopy() {
  copy(store.previewConfig || '')
}
const logoUrl = computed<string>(() => (themeStore.isDark ? darkLogo : lightLogo))
// setting
const setting = ref<typeof Setting>()
function handleShowSetting() {
  setting.value?.show()
}
</script>
<template>
  <NLayoutHeader class="sticky top-0 h-16 py-4 px-6" bordered>
    <div class="flex justify-between items-center h-full">
      <div class="flex items-center gap-x-2">
        <NTooltip placement="right" :style="{ maxWidth: '500px' }" trigger="hover">
          <template #trigger>
            <div class="h-full flex justify-start gap-x-2 items-center">
              <img height="32" :src="logoUrl" alt="" />
            </div>
          </template>
          {{ $t('about') }}
        </NTooltip>
        <Version />
      </div>
      <NSpace role="functional-btn" class="buttons-container">
        <NTooltip v-if="isSupported" placement="bottom" trigger="hover">
          <template #trigger>
            <NButton @click="handleCopy" strong quaternary>
              <template #icon>
                <BIconClipboard v-if="!copied" />
                <BIconClipboardCheck v-else /> </template
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
              <template #icon> <BIconGear /> </template
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
              <template #icon>
                <BIconGithub />
              </template>
            </NButton>
          </template>
          <span>{{ $t('nav.github') }}</span>
        </NTooltip>
      </NSpace>
    </div>
  </NLayoutHeader>
  <Setting ref="setting" />
</template>
