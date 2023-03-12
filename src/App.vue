<template>
  <NConfigProvider :theme="currentTheme" :hljs="hljs">
    <NMessageProvider>
      <NLayout style="height: 100vh">
        <NLayoutHeader style="position: sticky; top: 0; height: 64px; padding: 15px 24px" bordered>
          <NSpace justify="space-between" align="center">
            <NSpace align="center">
              <img width="32" height="32" src="./assets/logo.png" alt="" />
              <NH2 style="margin-bottom: 0">Config helper</NH2>
              <!-- <span style="font-size: 12px">Ts is good，but configure it is not good</span> -->
            </NSpace>
            <NSpace role="functional-btn" class="buttons-container">
              <NButton @click="handleExport" strong secondary>
                <template #icon> <BIconDownload /> </template>{{ $t('nav.export') }}</NButton
              >
              <ThemeButton />
              <NDropdown
                placement="bottom-start"
                trigger="click"
                size="small"
                :options="lang"
                @select="handleSelectLanguage"
              >
                <NButton strong secondary>
                  <template #icon> <BIconTranslate /> </template
                ></NButton>
              </NDropdown>
              <NButton @click="showSetting = true" strong secondary>
                <template #icon> <BIconGearFill /> </template
              ></NButton>
            </NSpace>
          </NSpace>
        </NLayoutHeader>
        <Config />
      </NLayout>
      <NModal
        v-model:show="showSetting"
        :mask-closable="false"
        class="custom-card"
        preset="card"
        :style="{ width: '600px' }"
        title="设置"
        size="huge"
        :bordered="false"
      >
        <Setting ref="setting" />
        <template #footer>
          <NSpace :justify="'end'">
            <NButton type="primary" secondary @click="() => handleSaveSetting(false)" strong> 应用 </NButton>
            <NButton @click="() => handleSaveSetting(true)" strong secondary> 确定 </NButton>
          </NSpace>
        </template>
      </NModal>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script lang="ts" setup>
import { computed, ref, shallowRef, watchEffect } from 'vue'
import {
  NConfigProvider,
  NMessageProvider,
  darkTheme,
  lightTheme,
  NModal,
  NH2,
  NLayout,
  NButton,
  NLayoutHeader,
  NSpace,
  NDropdown
} from 'naive-ui'
import { SUPPORT_LOCALES, SUPPORT_LOCALES_LABEL } from '@constants'
import { setI18nLanguage, currentLang } from '@i18n'
import { BIconDownload, BIconGearFill, BIconTranslate } from 'bootstrap-icons-vue'
import ThemeButton from './components/ThemeButton.vue'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import Config from './views/Config.vue'
import Setting from './views/Setting.vue'
import useStore from './store/data'
import useThemeStore from './store/theme'

hljs.registerLanguage('json', json)
const currentTheme = shallowRef(darkTheme)
const store = useStore()
const themeStore = useThemeStore()

const lang = computed(() => {
  return Object.keys(SUPPORT_LOCALES).map((l) => {
    return {
      disabled: l === currentLang.value,
      label: SUPPORT_LOCALES_LABEL[l as keyof typeof SUPPORT_LOCALES_LABEL],
      key: l
    }
  })
})
function handleSelectLanguage(lang: SUPPORT_LOCALES) {
  setI18nLanguage(lang)
}
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
const showSetting = ref(false)
function handleSaveSetting(saveAndClose: boolean = false) {
  showSetting.value = !saveAndClose
  setting.value?.save()
}
</script>
