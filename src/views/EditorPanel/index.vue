<script lang="ts" setup>
import MonacoEditor from '@components/MonacoEditor.vue'
import { useEventListener, useSchemaData } from '@hooks'
import useDataStore from '@stores/data'
import { debounce, getParentKeyByNestedPropertyLineContent } from '@utils'

import { NLayoutContent } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import useThemeStore from '@stores/theme'
import useSettingStore from '@stores/setting'
import useRuntimeStore from '@stores/runtime'
const dataStore = useDataStore()
const themeStore = useThemeStore()
const settingStore = useSettingStore()
const runtimeStore = useRuntimeStore()
const monacoEditor = ref<typeof MonacoEditor>()
const { allOptionsFlatKeysMap } = await useSchemaData()
// user paste or input code
function handleChange(value: string) {
  dataStore.dispatchConfigWithJsonString(value, allOptionsFlatKeysMap)
}

const handleResize = debounce(() => {
  monacoEditor.value?.resize()
}, (1000 / 60) * 5)

const editorOptions = computed(() => {
  const { tabSize, fontSize, lineHeight, minimap, lineNumbers } = settingStore.editor
  return {
    lineNumbers: lineNumbers ? 'on' : 'off',
    language: 'json',
    theme: themeStore.isDark ? 'darkTheme' : 'lightTheme',
    fontSize,
    lineHeight,
    tabSize,
    minimap: {
      enabled: minimap
    }
  }
})
function handleCursorLineChange({
  cursorBeforeLineContent,
  cursorLineContent
}: Record<string, string>) {
  const keys = getParentKeyByNestedPropertyLineContent(cursorBeforeLineContent, cursorLineContent)
  if (keys) {
    const res = keys.reduce<string[]>((allKeys, currentKey) => {
      if (allOptionsFlatKeysMap.get(allKeys.join('.'))) return allKeys
      allKeys.push(currentKey)
      return allKeys
    }, [])
    runtimeStore.currentCurserLineFlatKey = res.join('.')
  }
}
defineExpose({
  handleResize: handleResize
})
onMounted(() => useEventListener(self, 'resize', handleResize))
</script>

<template>
  <NLayoutContent class="min-w-[200px] overflow-hidden">
    <MonacoEditor
      ref="monacoEditor"
      :model-value="dataStore.previewConfig"
      language="json"
      width="100%"
      height="calc(100vh - 64px)"
      @change="handleChange"
      @cursorLineChange="handleCursorLineChange"
      :options="editorOptions as any"
    />
  </NLayoutContent>
</template>
