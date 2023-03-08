import { defineStore, type PiniaPluginContext } from 'pinia'
import { diffArray, debounce, initValueByPath } from '../utils'
import { compare } from 'fast-json-patch'

type ConfigValue = boolean | string | string[] | undefined
interface State {
  config: string
  selectedKeys: string[]
  rawConfig: Record<string, any>
}

export default defineStore('data', {
  state: (): State => {
    return {
      config: '',
      selectedKeys: [
        'compilerOptions/target',
        'compilerOptions/useDefineForClassFields',
        'compilerOptions/module',
        'compilerOptions/moduleResolution',
        'compilerOptions/strict',
        'compilerOptions/jsx',
        'compilerOptions/sourceMap',
        'compilerOptions/resolveJsonModule',
        'compilerOptions/esModuleInterop',
        'compilerOptions/declaration',
        'compilerOptions/declarationDir',
        'compilerOptions/emitDeclarationOnly',
        'compilerOptions/skipLibCheck',
        'compilerOptions/lib',
        'compilerOptions/types',
        'compilerOptions/suppressImplicitAnyIndexErrors',
        'compilerOptions/baseUrl',
        'include',
        'exclude'
      ],
      // TODO: json 支持注释
      rawConfig: {
        'compilerOptions/target': 'ES2016',
        'compilerOptions/useDefineForClassFields': true,
        'compilerOptions/module': 'esnext',
        'compilerOptions/moduleResolution': 'node',
        'compilerOptions/strict': true,
        'compilerOptions/jsx': 'react-jsx',
        'compilerOptions/sourceMap': true,
        'compilerOptions/resolveJsonModule': true,
        'compilerOptions/esModuleInterop': true,
        'compilerOptions/declaration': true,
        'compilerOptions/declarationDir': './es',
        'compilerOptions/emitDeclarationOnly': true,
        'compilerOptions/skipLibCheck': true,
        'compilerOptions/lib': ['ESNext', 'dom', 'ESNext.Promise'],
        'compilerOptions/types': ['node', 'vite/client'],
        'compilerOptions/suppressImplicitAnyIndexErrors': true,
        'compilerOptions/baseUrl': '.',
        include: [
          'packages/index.ts',
          'packages/hooks/*.ts',
          'packages/utils/*.ts',
          'packages/components/**/*.vue',
          'packages/components/**/*.ts',
          'types/*.d.ts',
          'types/**/*.d.ts',
          'packages/env.d.ts'
        ],
        exclude: ['node_modules', 'es', 'dist']
      }
    }
  },
  getters: {
    previewConfig: (store) => {
      const { rawConfig } = store
      let obj = {}
      Object.keys(rawConfig).forEach((key) => initValueByPath(obj, key, rawConfig[key]))
      return Object.keys(obj).length ? obj : undefined
    }
  }
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
