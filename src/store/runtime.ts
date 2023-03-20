import { defineStore } from 'pinia'
import { RUN_TIME } from '@constants'
interface State {
  searchHitKeysMap: Record<string, boolean> | null
}

export default defineStore(RUN_TIME, {
  state: (): State => {
    return {
      searchHitKeysMap: null
    }
  },
  actions: {
    resetHitKeysMap(store: any) {
      store.searchHitKeysMap = null
    }
  }
})
