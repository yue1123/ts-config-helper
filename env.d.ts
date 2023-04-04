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
}

interface Window {}
