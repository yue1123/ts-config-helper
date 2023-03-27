import { defineStore } from 'pinia'
import { SETTING_STORAGE } from '@constants'
import { SUPPORT_LOCALES } from '@constants'
import { setI18nLanguage } from '@i18n'
interface State {
  editor: {
    tabSize: number
    fontSize: number
    lineHeight: number
    minimap: boolean
    lineNumbers: boolean
  }
  showDescription: boolean
  lang: SUPPORT_LOCALES
}

export const DEFAULT_SETTING = {
  editor: {
    tabSize: 2,
    fontSize: 14,
    lineHeight: 22,
    minimap: false,
    lineNumbers: true
  },
  showDescription: true,
  lang: SUPPORT_LOCALES['zh']
}

export default defineStore(SETTING_STORAGE, {
  state: (): State => {
    return {
      editor: {
        tabSize: 2,
        fontSize: 14,
        lineHeight: 22,
        minimap: false,
        lineNumbers: true
      },
      showDescription: true,
      lang: SUPPORT_LOCALES['zh']
    }
  },
  persist: {
    afterRestore(cacheStore) {
      setI18nLanguage(cacheStore.store.lang)
    }
  }
})
