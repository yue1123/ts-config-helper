/// <reference types="vite/client" />

declare module '*.json' {
  type json = string
  export default json
}
declare module 'splitpanes' {
  import { Component } from 'vue'
  export const Splitpanes: Component
  export const Pane: Component
}

// i18n translate key
declare module '@intlify/message-resolver' {
  import I18nStore from '@i18n/locale/zh_cn.json'

  export type PickupPathKey<
    T extends Record<string, any>,
    K extends string | null = null,
    M = keyof T
  > = M extends string ? PickupPathKey<T[M], K extends string ? `${K}.${M}` : M> : K

  export declare type Path = PickupPathKey<typeof I18nStore>
}
