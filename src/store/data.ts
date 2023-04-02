import { DATA_CACHE } from '@constants'
import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import { initValueByPath } from '../utils'

import useSettingStore from './setting'

export default defineStore(
  DATA_CACHE,
  () => {
    const userSetting = useSettingStore()
    const config = ref<string>('')
    const selectedKeys = ref<string[]>([])
    const rawConfig = ref<Record<string, any>>({})
    const previewConfig = computed(() => {
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

    return { config, selectedKeys, rawConfig, previewConfig }
  },
  {
    persist: import.meta.env.PROD
  }
)

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
