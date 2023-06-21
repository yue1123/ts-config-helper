<script lang="ts" setup>
import { NButton, NLayoutHeader, NSpace, NTooltip } from 'naive-ui'
import { computed, ref } from 'vue'
import ThemeButton from '@components/ThemeButton.vue'
import useStore from '@stores/data'
import useThemeStore from '@stores/theme'
import Setting from '@views/Setting.vue'
import { useClipboard } from '@vueuse/core'
import { BIconClipboardCheck, BIconClipboard, BIconGear, BIconGithub } from 'bootstrap-icons-vue'
// import Version from '@components/Version.vue'
import { Icon } from '@iconify/vue'
import darkLogo from '../assets/logo.png'
import lightLogo from '../assets/logo-light.png'
const store = useStore()
const { copy, copied, isSupported } = useClipboard()
const themeStore = useThemeStore()

const emits = defineEmits(['showAbout'])
const logoUrl = computed<string>(() => (themeStore.isDark ? darkLogo : lightLogo))
// setting
const setting = ref<typeof Setting>()

function handleCopy() {
  copy(store.previewConfig || '')
}
function handleShowSetting() {
  setting.value?.show()
}
function handleLogoClick() {
  emits('showAbout')
}
</script>
<template>
  <NLayoutHeader class="sticky top-0 h-16 py-4 px-6" bordered>
    <div class="flex justify-between items-center h-full">
      <div class="flex items-center gap-x-2">
        <NTooltip
          placement="bottom-start"
          :style="{ maxWidth: '500px' }"
          trigger="hover"
          :showArrow="false"
        >
          <template #trigger>
            <div
              @click="handleLogoClick"
              class="h-full flex justify-start gap-x-2 items-center cursor-pointer"
            >
              <img height="32" :src="logoUrl" alt="" />
            </div>
          </template>
          {{ $t('site.about') }}
        </NTooltip>
        <!-- <Version /> -->
      </div>
      <div role="functional-btn" class="buttons-container flex gap-6">
        <NTooltip v-if="isSupported" placement="bottom" trigger="hover" :showArrow="false">
          <template #trigger>
            <NButton text @click="handleCopy" strong>
              <template #icon>
                <BIconClipboard v-if="!copied" />
                <BIconClipboardCheck v-else />
              </template>
            </NButton>
          </template>
          <span v-if="!copied">{{ $t('nav.copyToClipboard') }}</span>
          <span v-else>{{ $t('nav.copied') }}</span>
        </NTooltip>
        <NTooltip placement="bottom" trigger="hover" :showArrow="false">
          <template #trigger>
            <NButton text @click="handleShowSetting" strong>
              <template #icon> <Icon icon="bi:sliders2" /> </template
            ></NButton>
          </template>
          <span>{{ $t('nav.setting') }}</span>
        </NTooltip>
        <NTooltip placement="bottom" trigger="hover" :showArrow="false">
          <template #trigger>
            <ThemeButton />
          </template>
          <span>{{ $t('nav.theme') }}</span>
        </NTooltip>
        <NTooltip placement="bottom" trigger="hover" :showArrow="false">
          <template #trigger>
            <NButton
              text
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
      </div>
    </div>
  </NLayoutHeader>
  <Setting ref="setting" />
</template>
