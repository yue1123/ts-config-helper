import { defineStore } from 'pinia'
import { SETTING_STORAGE, SUPPORT_LOCALES } from '@constants'
import { setI18nLanguage } from '@i18n'
import { ref, watch } from 'vue'
import { getBrowserLang } from '@utils'
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

// loadLocaleMessages

export default defineStore(
  SETTING_STORAGE,
  () => {
    const editor = ref<State['editor']>({
      tabSize: 2,
      fontSize: 14,
      lineHeight: 22,
      minimap: false,
      lineNumbers: true
    })
    const showDescription = ref<boolean>(true)
    const lang = ref<SUPPORT_LOCALES>(SUPPORT_LOCALES[getBrowserLang()])
    watch(
      () => lang.value,
      (newLang: SUPPORT_LOCALES) => setI18nLanguage(newLang)
    )

    return { editor, showDescription, lang }
  },
  {
    persist: {
      afterRestore(cacheStore) {
        setI18nLanguage(cacheStore.store.lang)
      }
    }
  }
)
