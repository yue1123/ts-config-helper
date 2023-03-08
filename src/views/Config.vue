<template>
  <NLayout style="height: calc(100vh - 64px)" has-sider>
    <NLayoutSider
      collapse-mode="transform"
      :collapsed-width="0"
      :width="450"
      show-trigger="bar"
      content-style="padding:15px 24px;"
      bordered
      :native-scrollbar="false"
    >
      <NSpace vertical>
        <NInput :placeholder="$t('config.searchConfig')"></NInput>
        <MyCheckbox :level="0" :data="options" />
      </NSpace>
    </NLayoutSider>
    <NLayoutContent style="width: 50%">
      <NScrollbar style="padding: 15px 24px 15px 30px; height: calc(100vh - 64px)">
        <Property :level="1" :definition="options"></Property>
      </NScrollbar>
    </NLayoutContent>
    <NLayoutContent style="width: 50%; border-left: 1px solid var(--vt-c-divider-dark-2)">
      <MonacoEditor
        :model-value="JSON.stringify(store.previewConfig, null, 2)"
        :language="language"
        width="100%"
        height="calc(100vh - 64px)"
        theme="vs-dark"
        @change="handleChange"
      ></MonacoEditor>
    </NLayoutContent>
  </NLayout>
</template>

<script lang="ts" setup>
import { ref, shallowRef } from 'vue'
import {
  NH2,
  NLayout,
  NButton,
  NLayoutHeader,
  NLayoutSider,
  NSpace,
  NLayoutContent,
  NCode,
  NInput,
  NScrollbar
} from 'naive-ui'
import { BIconDownload } from 'bootstrap-icons-vue'
import { parse, stripComments } from 'jsonc-parser'
import useStore from '../store/index'
import { getValueByPath, parsePath, flatObjDeep } from '../utils'
import tsconfigSchema from '../schema/tsconfig'
import Property from './Property.vue'
import MyCheckbox from './Checkbox.vue'
import MonacoEditor from '../components/MonacoEditor.vue'
import type { Options } from '../types'

const language = ref('json')
const store = useStore()

function getOptions(rawData: any, keys: string[]): Options[] {
  let tempKeys = [...keys]
  // @ts-ignore
  return Object.keys(rawData).map((key) => {
    let ele = rawData[key]
    const refProperty = ele.allOf
      ? ele.allOf.map(({ $ref }: Record<string, any>) =>
          getValueByPath(tsconfigSchema, parsePath($ref))
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
      key: [...tempKeys, key].join('/'),
      children: ele.properties ? getOptions(ele.properties, tempKeys) : []
    }
  })
}

const allDefinitions: Record<string, any> = tsconfigSchema.definitions
const options = shallowRef(
  Object.keys(allDefinitions).reduce<Options[]>((_values, key) => {
    if (allDefinitions[key].properties) {
      _values.push.apply(_values, getOptions(allDefinitions[key].properties, []))
    }
    return _values
  }, [])
)

// user paste code
function handleChange(value: string) {
  try {
    store.rawConfig = flatObjDeep(parse(value))
    let selectedKeys = Object.keys(store.rawConfig)
    if (JSON.stringify(selectedKeys) !== JSON.stringify(store.selectedKeys)) {
      store.selectedKeys = Object.assign(selectedKeys, store.selectedKeys)
    }
  } catch (error) {
    // console.log(error)
  }
}
</script>
