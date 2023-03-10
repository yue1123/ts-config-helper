<template>
  <NForm
    ref="formRef"
    :model="settingCopy"
    label-placement="left"
    label-width="auto"
    require-mark-placement="right-hanging"
  >
    <NDivider title-placement="left" dashed> 常规 </NDivider>
    <NFormItem label="是否显示配置描述" path="showDescription">
      <NSwitch v-model:value="settingCopy.showDescription" />
    </NFormItem>
    <NDivider title-placement="left" dashed> 编辑器 </NDivider>
    <NFormItem label="Tab size" path="editor.tabSize">
      <NInputNumber v-model:value="settingCopy.editor.tabSize" />
    </NFormItem>
    <NFormItem label="Font size" path="editor.fontSize">
      <NInputNumber v-model:value="settingCopy.editor.fontSize" />
    </NFormItem>
    <NFormItem label="Line height" path="editor.lineHeight">
      <NInputNumber v-model:value="settingCopy.editor.lineHeight" />
    </NFormItem>
    <NFormItem label="是否显示小地图" path="editor.minimap">
      <NSwitch v-model:value="settingCopy.editor.minimap" />
    </NFormItem>
    <NFormItem label="是否显示代码行号" path="editor.lineNumbers">
      <NSwitch v-model:value="settingCopy.editor.lineNumbers" />
    </NFormItem>
  </NForm>
</template>

<script lang="ts" setup>
import { NForm, NFormItem, NSwitch, NInputNumber, NDivider } from 'naive-ui'
import { reactive } from 'vue'
import useSettingStore from '@store/setting'
const settingStore = useSettingStore()
const settingCopy = reactive(JSON.parse(JSON.stringify(settingStore.$state)))

defineExpose({
  save: () => {
    settingStore.$state = settingCopy
  }
})
</script>

<style></style>
