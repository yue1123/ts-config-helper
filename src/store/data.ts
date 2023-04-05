import { DATA_CACHE } from '@constants'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { initValueByPath } from '../utils'
// import { parse, format, modify, applyEdits } from 'jsonc-parser'
// import { diff, jsonPatchPathConverter } from 'just-diff'

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
    return { config, selectedKeys, rawConfig, previewConfig }
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
