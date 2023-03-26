<template>
  <NModal
    v-model:show="showSetting"
    :mask-closable="false"
    class="custom-card"
    preset="card"
    :style="{ width: '600px' }"
    :title="$t('setting.title')"
    size="huge"
    :bordered="true"
  >
    <NForm
      ref="formRef"
      :model="settingCopy"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
    >
      <NDivider title-placement="left" dashed>
        {{ $t('setting.general') }}
      </NDivider>
      <NFormItem :label="$t('setting.language')" path="showDescription">
        <NDropdown
          placement="bottom-start"
          trigger="click"
          size="small"
          :options="lang"
          @select="handleSelectLanguage"
        >
          <NButton strong secondary>
            {{ SUPPORT_LOCALES_LABEL[settingCopy.lang as keyof typeof SUPPORT_LOCALES_LABEL] }}
          </NButton>
        </NDropdown>
      </NFormItem>
      <NFormItem :label="$t('setting.showDescription')" path="showDescription">
        <NSwitch v-model:value="settingCopy.showDescription" />
      </NFormItem>
      <NDivider title-placement="left" dashed>
        {{ $t('setting.editor') }}
      </NDivider>
      <NFormItem :label="$t('setting.editorSetting.tabSize')" path="editor.tabSize">
        <NInputNumber v-model:value="settingCopy.editor.tabSize" />
      </NFormItem>
      <NFormItem :label="$t('setting.editorSetting.fontSize')" path="editor.fontSize">
        <NInputNumber v-model:value="settingCopy.editor.fontSize" />
      </NFormItem>
      <NFormItem :label="$t('setting.editorSetting.lineHeight')" path="editor.lineHeight">
        <NInputNumber v-model:value="settingCopy.editor.lineHeight" />
      </NFormItem>
      <NFormItem :label="$t('setting.editorSetting.minimap')" path="editor.minimap">
        <NSwitch v-model:value="settingCopy.editor.minimap" />
      </NFormItem>
      <NFormItem :label="$t('setting.editorSetting.lineNumbers')" path="editor.lineNumbers">
        <NSwitch v-model:value="settingCopy.editor.lineNumbers" />
      </NFormItem>
    </NForm>
    <template #footer>
      <NSpace :justify="'end'">
        <NButton quaternary @click="() => resetDefaultSetting()" strong>
          {{ $t('setting.resetDefault') }}
        </NButton>
        <NButton type="primary" @click="() => handleSaveSetting(false)" strong secondary>
          {{ $t('setting.apply') }}
        </NButton>
        <NButton type="primary" @click="() => handleSaveSetting(true)" strong>
          {{ $t('setting.confirm') }}
        </NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<script lang="ts" setup>
import {
  NForm,
  NFormItem,
  NDropdown,
  NSwitch,
  NInputNumber,
  NDivider,
  NSpace,
  NModal,
  NButton
} from 'naive-ui'
import { computed, reactive, ref } from 'vue'
import useSettingStore, { DEFAULT_SETTING } from '@store/setting'
import { SUPPORT_LOCALES, SUPPORT_LOCALES_LABEL } from '@constants'
import { currentLang, setI18nLanguage } from '@i18n'
import { deepClone } from '@utils'
const settingStore = useSettingStore()
const showSetting = ref(false)
let settingCopy = ref(deepClone(settingStore.$state))

const lang = computed(() => {
  return Object.keys(SUPPORT_LOCALES).map((l) => {
    return {
      disabled: l === currentLang.value,
      label: SUPPORT_LOCALES_LABEL[l as keyof typeof SUPPORT_LOCALES_LABEL],
      key: l
    }
  })
})
function resetDefaultSetting() {
  settingCopy.value = deepClone(DEFAULT_SETTING)
}
function handleSelectLanguage(lang: SUPPORT_LOCALES) {
  settingCopy.value.lang = lang
}
function save() {
  settingStore.$state = deepClone(settingCopy.value)
}
defineExpose({
  show: () => {
    showSetting.value = true
  },
  hide: () => {
    showSetting.value = false
  },
  save
})
function handleSaveSetting(saveAndClose: boolean = false) {
  showSetting.value = !saveAndClose
  setI18nLanguage(settingCopy.value.lang)
  save()
}
</script>

<style></style>
