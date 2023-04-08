<script lang="ts" setup>
import { ref } from 'vue'
import { NButton, NLayoutHeader, NSpace, NTooltip } from 'naive-ui'

import {
  BIconClipboardFill,
  BIconClipboardCheckFill,
  BIconGearFill,
  BIconGithub
} from 'bootstrap-icons-vue'
import { useClipboard } from '@vueuse/core'
import ThemeButton from '@components/ThemeButton.vue'
import Setting from '@views/Setting.vue'
import useStore from '@store/data'
const store = useStore()
const { copy, copied, isSupported } = useClipboard()

function handleCopy() {
  copy(store.previewConfig || '')
}

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
              <img height="32" src="../assets/logo.png" alt="" />
            </div>
          </template>
          {{ $t('about') }}
        </NTooltip>
        <img
          alt="GitHub tag (latest by date)"
          src="https://img.shields.io/github/v/tag/yue1123/ts-config-helper?label=Tag%20&logo=github&style=flat-square"
        />
      </div>

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
