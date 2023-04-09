<script lang="ts" setup>
import { useEventListener, useSchemaData } from '@hooks'
import { currentLang } from '@i18n'
import useStore from '@store/data'
import json5 from 'json5'
import { NLayoutContent } from 'naive-ui'
import { onMounted, ref } from 'vue'
import MonacoEditor from '../components/MonacoEditor.vue'
import { debounce, flatObjWithDepthControl } from '../utils'

const language = ref('json')
const store = useStore()
const monacoEditor = ref<typeof MonacoEditor>()
const { allOptionsFlatKeysMap } = await useSchemaData()
// user paste or input code
function handleChange(value: string) {
  if (value) {
    try {
      const parseObj = json5.parse(value)
      const res = flatObjWithDepthControl(parseObj, (item) => {
        // check is max level
        // if value is user value object, should not flatten
        return !allOptionsFlatKeysMap.get(item)
      })
      store.rawConfig = res
      let selectedKeys = Object.keys(store.rawConfig)
      if (JSON.stringify(selectedKeys) !== JSON.stringify(store.selectedKeys)) {
        store.selectedKeys = [...store.selectedKeys, ...selectedKeys]
      }
    } catch (error) {}
  } else {
    store.selectedKeys = []
    store.rawConfig = {}
  }
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
      :model-value="store.previewConfig"
      :language="language"
      width="100%"
      height="calc(100vh - 64px)"
      theme="vs-dark"
      @change="handleChange"
      schema-url="../assets/_tsconfig.json"
    ></MonacoEditor>
  </NLayoutContent>
</template>
