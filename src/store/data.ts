import { DATA_CACHE } from '@constants'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { initValueByPath, deepClone } from '@utils'
// import { parse, format, modify, applyEdits } from 'jsonc-parser'
// import { diff, jsonPatchPathConverter } from 'just-diff'
import json5 from 'json5'
import { flatObjWithDepthControl } from '@utils'
import useSettingStore from './setting'
interface ConfigItemState {
  name: string
  config: string
  selectedKeys: string[]
  rawConfig: Record<string, any>
}

const dataStore = defineStore(
  DATA_CACHE,
  () => {
    const userSetting = useSettingStore()

    const config = ref<string>('')
    const selectedKeys = ref<string[]>([])
    const rawConfig = ref<Record<string, any>>({})

    const configList = ref<ConfigItemState[]>([
      {
        name: 'tsconfig.json',
        config: config.value,
        selectedKeys: selectedKeys.value,
        rawConfig: rawConfig.value
      }
    ])
    const currentConfigName = ref<string>(configList.value[0].name)
    // 预览配置
    const previewConfig = computed(() => {
      // let editorValue: Record<string, any> | null = parse(config.value)
      const _rawConfig = rawConfig.value
      let obj = {}
      Object.keys(_rawConfig).forEach((key) => {
        let ele = _rawConfig[key]
        initValueByPath(obj, key, ele)
      })
      return Object.keys(obj).length
        ? JSON.stringify(obj, null, userSetting.editor.tabSize)
        : undefined
    })
    // 上次的值保存与新值更新
    watch(
      () => currentConfigName.value,
      (newKey, oldKey) => {
        let oldConfig = configList.value.find((item) => item.name === oldKey)
        let newConfig = configList.value.find((item) => item.name === newKey)
        if (oldConfig) {
          oldConfig.config = config.value
          oldConfig.selectedKeys = deepClone(selectedKeys.value)
          oldConfig.rawConfig = deepClone(rawConfig.value)
        }
        if (newConfig) {
          config.value = newConfig.config
          selectedKeys.value = deepClone(newConfig.selectedKeys)
          rawConfig.value = deepClone(newConfig.rawConfig)
        }
      }
    )
    function addConfigTab() {
      const name = `tsconfig.${Math.random()}.json`
      configList.value.push({
        name,
        config: '',
        selectedKeys: [],
        rawConfig: {}
      })
      currentConfigName.value = name
    }
    function removeConfigTab(name: string) {
      let index = configList.value.findIndex((item) => item.name === name)
      if (configList.value[index].name === currentConfigName.value) {
        currentConfigName.value = configList.value[index - 1].name
      }
      configList.value.splice(index, 1)
    }
    function dispatchConfigWithJsonString(
      value: string,
      allOptionsFlatKeysMap: Map<string, boolean>,
      clear: boolean = false
    ) {
      if (value) {
        try {
          const parseObj = json5.parse(value)
          const res = flatObjWithDepthControl(parseObj, (item) => {
            // check is max level
            // if value is user value object, should not flatten
            return !allOptionsFlatKeysMap.get(item)
          })
          rawConfig.value = res
          let newSelectedKeys = Object.keys(rawConfig.value)
          if (clear) {
            selectedKeys.value = newSelectedKeys
          } else {
            selectedKeys.value = [...new Set(newSelectedKeys.concat(selectedKeys.value))]
          }
        } catch (error) {}
      } else {
        selectedKeys.value = []
        rawConfig.value = {}
      }
    }
    return {
      config,
      selectedKeys,
      rawConfig,
      previewConfig,
      currentConfigName,
      configList,
      addConfigTab,
      removeConfigTab,
      dispatchConfigWithJsonString
    }
  },
  {
    persist: import.meta.env.PROD
  }
)

export default dataStore

// export function watchChange({ store }: PiniaPluginContext) {
//   store.$subscribe(
//     debounce((context) => {
//       //  && context.target == store.rawConfig
//       if (context.storeId === 'data' && context.events.key === 'rawConfig') {
//         // console.log(123)
//         console.log(context)
//         console.log(compare(context.events.newValue, context.events.oldValue))
//         // const { events }: { events: any } = context
//         // const {add, delete } = diffArray(events.newValue, events.oldValue)
//         // add.forEach((addKey) => initValueByPath(store.raw,addKey,''))
//         // add.forEach((addKey) => initValueByPath(store.raw,addKey,''))
//       }
//     }, 300)
//   )
// }
