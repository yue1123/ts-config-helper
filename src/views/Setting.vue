<template>
  <NModal
    v-model:show="showSetting"
    :mask-closable="false"
    class="custom-card"
    preset="card"
    :style="{ width: '600px' }"
    :title="$t('setting.title')"
    size="huge"
    :bordered="false"
  >
    <NForm
      ref="formRef"
      :model="settingCopy"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
    >
      <NDivider title-placement="left" dashed> {{ $t('setting.general') }} </NDivider>
      <NFormItem :label="$t('setting.showDescription')" path="showDescription">
        <NSwitch v-model:value="settingCopy.showDescription" />
      </NFormItem>
      <NDivider title-placement="left" dashed> {{ $t('setting.editor') }} </NDivider>
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
        <NButton type="primary" secondary @click="() => handleSaveSetting(false)" strong>
          应用
        </NButton>
        <NButton @click="() => handleSaveSetting(true)" strong secondary> 确定 </NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<script lang="ts" setup>
import {
  NForm,
  NFormItem,
  NSwitch,
  NInputNumber,
  NDivider,
  NSpace,
  NModal,
  NButton
} from 'naive-ui'
import { reactive, ref } from 'vue'
import useSettingStore from '@store/setting'
const settingStore = useSettingStore()
const settingCopy = reactive(JSON.parse(JSON.stringify(settingStore.$state)))
const showSetting = ref(false)

function save() {
  settingStore.$state = settingCopy
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
  save()
}
</script>

<style></style>
