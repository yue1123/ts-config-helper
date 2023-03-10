import { defineStore, type PiniaPluginContext } from 'pinia'
import { diffArray, debounce, initValueByPath } from '../utils'
import { compare } from 'fast-json-patch'
import { DATA_CACHE } from '@constants'

type ConfigValue = boolean | string | string[] | undefined
interface State {
  config: string
  selectedKeys: string[]
  rawConfig: Record<string, any>
}

export default defineStore(DATA_CACHE, {
  state: (): State => {
    return {
      config: '',
      selectedKeys: [],
      // TODO: json 支持注释
      rawConfig: {}
    }
  },
  getters: {
    previewConfig: (store) => {
      const { rawConfig } = store
      let obj = {}
      Object.keys(rawConfig).forEach((key) => initValueByPath(obj, key, rawConfig[key]))
      return Object.keys(obj).length ? obj : undefined
    }
  },
  persist: true
})

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
