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
        <MyCheckbox :level="0" :data="options" />
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
            <Property :level="1" :definition="options"></Property>
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

<script lang="ts" setup>
import { onMounted, ref, watchEffect, shallowRef } from 'vue'
import { NLayout, NLayoutSider, NSpace, NLayoutContent, NScrollbar } from 'naive-ui'
import { useEventListener } from '@hooks'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { parse, stripComments } from 'jsonc-parser'
import useStore from '../store/data'
import useSettingStore from '../store/setting'
import { getValueByPath, parsePath, flatObjDeep, debounce } from '../utils'
import tsconfigSchema from '../schema/_tsconfig.json'
import tsconfigZhCNSchema from '../schema/_tsconfig.zh.json'
import Property from './Property.vue'
import MyCheckbox from './Checkbox.vue'
import MonacoEditor from '../components/MonacoEditor.vue'
import type { Options } from '../types'
import { currentLang } from '@i18n'

const schemaMap = {
  'en-US': tsconfigSchema,
  zh_cn: tsconfigZhCNSchema
}
const language = ref('json')
const store = useStore()
const settingStore = useSettingStore()

const monacoEditor = ref<typeof MonacoEditor>()

function getOptions(rawData: any, keys: string[]): Options[] {
  let tempKeys = [...keys]
  // @ts-ignore
  return Object.keys(rawData).map((key) => {
    let ele = rawData[key]
    const refProperty = ele.allOf
      ? ele.allOf.map(({ $ref }: Record<string, any>) =>
          getValueByPath(tsconfigSchema, parsePath($ref, '/'))
        )
      : null
    if (refProperty) {
      refProperty.map((item: Record<string, any>) => {
        ele = Object.assign(ele, item)
      })
    }
    if (ele.properties) {
      tempKeys.push(key)
    }
    return {
      ...ele,
      label: key,
      key: [...tempKeys, key].join('.'),
      children: ele.properties ? getOptions(ele.properties, tempKeys) : []
    }
  })
}
const options = shallowRef()
watchEffect(() => {
  let schema = (schemaMap as any)[currentLang.value]
  if (!schema) schema = (schemaMap as any)['en-US']
  const allDefinitions: Record<string, any> = schema.definitions
  Reflect.deleteProperty(allDefinitions, '//')
  options.value = Object.keys(allDefinitions).reduce<Options[]>((_values, key) => {
    if (allDefinitions[key].properties) {
      _values.push.apply(_values, getOptions(allDefinitions[key].properties, []))
    }
    return _values
  }, [])
})

// user paste or input code
function handleChange(value: string) {
  if (value) {
    try {
      const { res, parentNodeKey } = flatObjDeep(parse(value))
      store.rawConfig = res
      let selectedKeys = Object.keys(store.rawConfig)
      if (JSON.stringify(selectedKeys) !== JSON.stringify(store.selectedKeys)) {
        store.selectedKeys = selectedKeys.concat(parentNodeKey)
        console.log(store.selectedKeys, '==========')
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
