import { defineStore } from 'pinia'
import { RUN_TIME } from '@constants'
interface State {
  searchHitKeysCountMap: Record<string, number> | null
  searchHitKeysMap: Record<string, boolean> | null
  collapseExpandedNames: string[]
  currentCurserLineFlatKey: string | null
}

export default defineStore(RUN_TIME, {
  state: (): State => {
    return {
      searchHitKeysCountMap: null,
      searchHitKeysMap: null,
      collapseExpandedNames: [],
      currentCurserLineFlatKey: null
    }
  },
  actions: {
    resetHitKeysMap(store: any, value: null | Record<string, boolean>) {
      store.searchHitKeysMap = value
      store.searchHitKeysCountMap = value
    }
  }
})
