<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { NLayout, NLayoutSider, NSpace, NInput, NLayoutContent, NScrollbar } from 'naive-ui'
import { useEventListener, useProperty } from '@hooks'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
// import { parse, stripComments } from 'jsonc-parser'
import useStore from '@store/data'
import useRuntimeStore from '@store/runtime'
import useSettingStore from '@store/setting'
import { getValueByPath, parsePath, flatObjWithDepthControl, debounce } from '../utils'
import Property from './Property.vue'
import MyCheckbox from './Checkbox.vue'
import MonacoEditor from '../components/MonacoEditor.vue'
import { currentLang } from '@i18n'
import json5 from 'json5'

const { property, allFlatPropertyKeysMap, allFlatPropertyKeys } = useProperty()
const language = ref('json')
const store = useStore()
const runtimeStore = useRuntimeStore()
const settingStore = useSettingStore()
const monacoEditor = ref<typeof MonacoEditor>()

// user paste or input code
function handleChange(value: string) {
  if (value) {
    try {
      const res = flatObjWithDepthControl(json5.parse(value), (item) => {
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

// # search
const handleSearch = debounce((searchKeyword: string) => {
  // runtimeStore
  let obj = Object.create(null)
  if (searchKeyword) {
    for (const item of allFlatPropertyKeys) {
      if (item.indexOf(searchKeyword) !== -1) {
        obj[item] = true
      }
    }
    runtimeStore.searchHitKeysMap = obj
  } else {
    runtimeStore.resetHitKeysMap(runtimeStore)
  }
}, 200)
// # end search

onMounted(() => useEventListener(self, 'resize', handleResize))
</script>

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
        <NInput clear @input="handleSearch" :placeholder="$t('config.searchConfig')"></NInput>
        <div
          :style="{
            height: '25px',
            lineHeight: '25px',
            opacity: runtimeStore.searchHitKeysMap ? 1 : 0
          }"
        >
          {{ runtimeStore.searchHitKeysMap && Object.keys(runtimeStore.searchHitKeysMap).length }}
          {{ $t('result') }}
        </div>
        <MyCheckbox :level="0" :data="property" />
      </NSpace>
    </NLayoutSider>
    <Splitpanes @resize="handleResize" :dblClickSplitter="false">
      <Pane style="min-width: 240px">
        <NLayoutContent>
          <NScrollbar style="padding: 15px 24px 15px 30px; height: calc(100vh - 64px)">
            <!-- <TransitionGroup
              enter-active-class="animated animate__fadeInLeft"
              leave-active-class="animated animate__fadeOutRight"
            > -->
            <template key="tipText" v-if="!store.selectedKeys.length">
              <div class="tipText">{{ $t('about') }}</div>
              <div class="tipText">{{ $t('emptyTips') }}</div>
            </template>

            <Property key="property" :level="1" :definition="property"></Property>
            <!-- </TransitionGroup> -->
          </NScrollbar>
        </NLayoutContent>
      </Pane>
      <Pane style="min-width: 240px">
        <NLayoutContent>
          <MonacoEditor
            :local="currentLang"
            ref="monacoEditor"
            :model-value="JSON.stringify(store.previewConfig, null, settingStore.editor.tabSize)"
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
