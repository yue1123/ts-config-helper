import { defineStore, type PiniaPluginContext } from 'pinia'
import { diffArray, debounce, initValueByPath } from '../utils'
import { compare } from 'fast-json-patch'
import { DATA_CACHE } from '@constants'
// import prettier from 'https://unpkg.com/prettier@2.5.1/esm/standalone.mjs'
// import parserBabel from 'https://unpkg.com/prettier@2.5.1/esm/parser-babel.mjs' 


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
      selectedKeys: ['compilerOptions.paths'],
      // TODO: json 支持注释
      rawConfig: {}
    }
  },
  getters: {
    previewConfig: (store) => {
      const rawConfig = store.rawConfig
      let obj = {}
      Object.keys(rawConfig).forEach((key) => {
        let ele = rawConfig[key]
        if (!ele.ignoreNode) {
          initValueByPath(obj, key, ele)
        }
      })
      const a = Object.keys(obj).length ? obj : undefined
      // console.log(
      //   prettier.format(JSON.stringify(a), {
      //     parser: 'babel',
      //     plugins: [parserBabel]
      //   })
      // )
      return a
    }
  },
  persist: true || import.meta.env.PROD
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
