<template>
  <NLayout style="height: calc(100vh - 64px)" has-sider>
    <NLayoutSider
      collapse-mode="transform"
      :collapsed-width="0"
      :width="430"
      show-trigger="bar"
      content-style="padding:15px 24px;"
      bordered
      :native-scrollbar="false"
      :on-after-enter="handleResize"
      :on-after-leave="handleResize"
    >
      <NSpace vertical>
        <!-- <NInput :placeholder="$t('config.searchConfig')"></NInput> -->
        <MyCheckbox :level="0" :data="property" />
      </NSpace>
    </NLayoutSider>
    <Splitpanes @resize="handleResize" :dblClickSplitter="false">
      <Pane style="min-width: 240px">
        <NLayoutContent>
          <NScrollbar style="padding: 15px 24px 15px 30px; height: calc(100vh - 64px)">
            <template v-if="!store.selectedKeys.length">
              <div class="tipText">{{ $t('about') }}</div>
              <div class="tipText">{{ $t('emptyTips') }}</div>
            </template>
            <Property :level="1" :definition="property"></Property>
          </NScrollbar>
        </NLayoutContent>
      </Pane>
      <Pane style="min-width: 240px">
        <NLayoutContent>
          <!-- (, null, settingStore.editor.tabSize) -->
          <MonacoEditor
            :local="currentLang"
            ref="monacoEditor"
            :model-value="JSON.stringify(store.previewConfig)"
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

<script lang="ts" setup>
import { onMounted, ref, watchEffect, shallowRef } from 'vue'
import { NLayout, NLayoutSider, NSpace, NLayoutContent, NScrollbar } from 'naive-ui'
import { useEventListener, useProperty } from '@hooks'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { parse, stripComments } from 'jsonc-parser'
import useStore from '../store/data'
import useSettingStore from '../store/setting'
import { getValueByPath, parsePath, flatObjWithDepthControl, debounce } from '../utils'
import Property from './Property.vue'
import MyCheckbox from './Checkbox.vue'
import MonacoEditor from '../components/MonacoEditor.vue'
import { currentLang } from '@i18n'

const { property, allFlatPropertyKeysMap } = useProperty()
const language = ref('json')
const store = useStore()
const settingStore = useSettingStore()
const monacoEditor = ref<typeof MonacoEditor>()

// user paste or input code
function handleChange(value: string) {
  if (value) {
    try {
      const res = flatObjWithDepthControl(parse(value), (item) => {
        // check is max level
        // if value is user value object, should not flatten
        return !allFlatPropertyKeysMap.value.get(item)
      })
      store.rawConfig = res
      let selectedKeys = Object.keys(store.rawConfig)
      if (JSON.stringify(selectedKeys) !== JSON.stringify(store.selectedKeys)) {
        store.selectedKeys = selectedKeys
      }
    } catch (error) {
      console.log(error)
    }
  } else {
    store.selectedKeys = []
    store.rawConfig = {}
  }
}

const handleResize = debounce(() => {
  monacoEditor.value?.resize()
}, (1000 / 60) * 5)

onMounted(() => useEventListener(self, 'resize', handleResize))
</script>

<style scoped>
.tipText {
  color: var(--vt-c-divider-dark-2);
  text-align: center;
}
</style>
