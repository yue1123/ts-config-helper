<script lang="ts" setup>
import MonacoEditor from '@components/MonacoEditor.vue'
import { useEventListener, useSchemaData } from '@hooks'
import { currentLang } from '@i18n'
import useDataStore from '@store/data'
import { debounce } from '@utils'

import { NLayoutContent } from 'naive-ui'
import { onMounted, ref } from 'vue'

const language = ref('json')
const dataStore = useDataStore()
const monacoEditor = ref<typeof MonacoEditor>()
const { allOptionsFlatKeysMap } = await useSchemaData()
// user paste or input code
function handleChange(value: string) {
  dataStore.dispatchConfigWithJsonString(value, allOptionsFlatKeysMap)
}

const handleResize = debounce(() => {
  monacoEditor.value?.resize()
}, (1000 / 60) * 5)

defineExpose({
  handleResize: handleResize
})

onMounted(() => useEventListener(self, 'resize', handleResize))
</script>

<template>
  <NLayoutContent>
    <MonacoEditor
      :local="currentLang"
      ref="monacoEditor"
      :model-value="dataStore.previewConfig"
      :language="language"
      width="100%"
      height="calc(100vh - 64px)"
      theme="vs-dark"
      @change="handleChange"
    ></MonacoEditor>
  </NLayoutContent>
</template>
