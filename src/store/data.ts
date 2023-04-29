import { DATA_CACHE, numberReg } from '@constants'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { initValueByPath, deepClone } from '@utils'
// import { parse, format, modify, applyEdits } from 'jsonc-parser'
// import { diff, jsonPatchPathConverter } from 'just-diff'
import json5 from 'json5'
import { flatObjWithDepthControl } from '@utils'
import useSettingStore from './setting'
export interface ConfigItemState {
  name: string
  config: string
  selectedKeys: string[]
  rawConfig: Record<string, any>
}

const dataStore = defineStore(
  DATA_CACHE,
  () => {
    const userSetting = useSettingStore()
    // FIXME: tab 之间的 value 会连带
    const configList = ref<ConfigItemState[]>([
      {
        name: 'tsconfig.json',
        config: '',
        selectedKeys: [],
        rawConfig: {}
      }
    ])
    const config = ref<string>('')
    const selectedKeys = ref<string[]>([])
    const rawConfig = ref<Record<string, any>>({})
    const currentConfigName = ref<string>()
    const currentConfigIndex = ref<number>(0)
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
    let syncToConfigTarget: ConfigItemState | null
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
    function addConfigTab(name: string = '') {
      if (!name) {
        let nameIndex: number = configList.value.length
        for (let i = configList.value.length - 1; i >= 0; i--) {
          const item = configList.value[i]
          let res = item.name.match(numberReg)
          if (res) {
            nameIndex = +res[0] + 1
            break
          }
        }
        name = `tsconfig.${nameIndex}.json`
      }
      syncToConfigTarget = {
        name,
        config: '',
        selectedKeys: [],
        rawConfig: {}
      }
      configList.value.push(syncToConfigTarget)
      currentConfigName.value = name
    }
    function removeConfigTab(name: string) {
      let index = configList.value.findIndex((item) => item.name === name)
      if (configList.value[index].name === currentConfigName.value) {
        currentConfigName.value = configList.value[index === 0 ? index + 1 : index + 1].name
      }
      configList.value.splice(index, 1)
    }
    function renameConfigTab(item: ConfigItemState, newName: string) {
      if (currentConfigName.value === item.name) {
        currentConfigName.value = newName
      }
      item.name = newName
    }

    // update by json string
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
            return !!allOptionsFlatKeysMap.get(item)
          })
          // 过滤key, 避免叶子节点出现在面板中
          let newSelectedKeys = Object.keys(res).filter((key) => allOptionsFlatKeysMap.get(key))
          // 过滤空值节点, 避免右侧编辑器更改, 左侧消失
          let emptyValueKeys = selectedKeys.value.filter((key) => {
            return !rawConfig.value[key]
          })
          rawConfig.value = res
          if (clear) {
            selectedKeys.value.length = 0
          }
          selectedKeys.value = [...new Set(newSelectedKeys.concat(emptyValueKeys))]
          if (syncToConfigTarget) {
            syncToConfigTarget.config = value
            syncToConfigTarget.rawConfig = deepClone(res)
            syncToConfigTarget.selectedKeys = deepClone(selectedKeys.value)
            syncToConfigTarget = null
          }
        } catch (error) {}
      } else {
        selectedKeys.value = []
        rawConfig.value = {}
      }
    }
    const init = () => {
      const first = deepClone(configList.value[currentConfigIndex.value])
      config.value = first.config
      selectedKeys.value = first.selectedKeys
      rawConfig.value = first.rawConfig
      currentConfigName.value = first.name
    }
    init()
    return {
      config,
      selectedKeys,
      rawConfig,
      previewConfig,
      currentConfigName,
      currentConfigIndex,
      configList,
      addConfigTab,
      renameConfigTab,
      removeConfigTab,
      dispatchConfigWithJsonString
    }
  },
  {
    persist: import.meta.env.VITE_APP_SHOULD_CATCH_DATA === 'true' || import.meta.env.PROD
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
