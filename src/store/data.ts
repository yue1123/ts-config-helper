import { DATA_CACHE } from '@constants'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { initValueByPath } from '../utils'
// import { parse, format, modify, applyEdits } from 'jsonc-parser'
// import { diff, jsonPatchPathConverter } from 'just-diff'
import json5 from 'json5'
import { flatObjWithDepthControl } from '@utils'
import useSettingStore from './setting'

const dataStore = defineStore(
  DATA_CACHE,
  () => {
    const userSetting = useSettingStore()
    const config = ref<string>('')
    const selectedKeys = ref<string[]>([])
    const rawConfig = ref<Record<string, any>>({})
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
    // watch(
    //   () => config.value,
    //   (newValue) => {
    //     console.log(newValue)
    //   }
    // )
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
    return { config, selectedKeys, rawConfig, previewConfig, dispatchConfigWithJsonString }
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
