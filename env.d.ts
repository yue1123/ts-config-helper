/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Auto generate by env-parse
  /**
   * 控制 app store 数据是否缓存
   */
  VITE_APP_SHOULD_CATCH_DATA: boolean
  /**
   * 是否开启打包分析
   */
  VITE_APP_VISUALIZER_ENABLE: boolean
}
declare module '*.json' {
  type json = string
  export default json
}
declare module 'splitpanes' {
  import { Component } from 'vue'
  export const Splitpanes: Component
  export const Pane: Component
}
declare module 'https://json.schemastore.org/tsconfig' {
  export const tsconfig: string
}
declare module 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js' {
  export * from '@types/canvas-confetti'
}

// i18n translate key
declare module '@intlify/core-base' {
  import I18nStore from '@i18n/modules/zh.json'

  export type PickupPathKey<
    T extends Record<string, any>,
    K extends string | null = null,
    M = keyof T
  > = M extends string ? PickupPathKey<T[M], K extends string ? `${K}.${M}` : M> : K
  type keys = PickupPathKey<typeof I18nStore>

  export declare type Path = keys
  export declare type ResourceKeys = keys
  export declare type DefineLocaleMessage = typeof I18nStore
}

interface Window {}
