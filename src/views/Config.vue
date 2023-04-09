<script lang="ts" setup>
import { useEventListener, useProperty } from '@hooks'
import { currentLang } from '@i18n'
import useStore from '@store/data'
import json5 from 'json5'
import { NLayout, NLayoutContent, NScrollbar } from 'naive-ui'
import { Pane, Splitpanes } from 'splitpanes'
import { onMounted, ref } from 'vue'
import MonacoEditor from '../components/MonacoEditor.vue'
import { debounce, flatObjWithDepthControl } from '../utils'
import Property from './Property.vue'
import SideBar from './SideBar.vue'
import Empty from './Empty.vue'
const { property, allFlatPropertyKeysMap, allFlatPropertyKeys } = useProperty()
const language = ref('json')
const store = useStore()
const monacoEditor = ref<typeof MonacoEditor>()

// user paste or input code
function handleChange(value: string) {
  if (value) {
    try {
      const parseObj = json5.parse(value)
      const res = flatObjWithDepthControl(parseObj, (item) => {
        // check is max level
        // if value is user value object, should not flatten
        return !allFlatPropertyKeysMap.value.get(item)
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

const handleReady = () => {
  setTimeout(handleResize, 500)
}

onMounted(() => useEventListener(self, 'resize', handleResize))
</script>

<template>
  <NLayout style="height: calc(100vh - 64px)">
    <Splitpanes @ready="handleReady" @resize="handleResize" :dblClickSplitter="false">
      <Pane min-size="10"> <SideBar /> </Pane>
      <Pane min-size="10">
        <NLayoutContent>
          <NScrollbar class="p-5" style="height: calc(100vh - 64px)">
            <template key="tipText" v-if="!store.selectedKeys.length">
              <Empty />
            </template>
            <template v-else>
              <Property key="property" :level="1" :definition="property"></Property>
            </template>
          </NScrollbar>
        </NLayoutContent>
      </Pane>
      <Pane min-size="10">
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
          ></MonacoEditor>
        </NLayoutContent>
      </Pane>
    </Splitpanes>
  </NLayout>
</template>

<style scoped>
.tipText {
  color: var(--vt-c-placeholder);
  text-align: center;
}
</style>
