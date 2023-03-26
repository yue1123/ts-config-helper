import { ref } from 'vue'
import { createI18n, type VueI18nOptions } from 'vue-i18n'
import { SUPPORT_LOCALES } from '@constants'
import en from '@i18n/locale/en.json'
import zh from '@i18n/locale/zh.json'
import ja from '@i18n/locale/ja.json'
import useSettingStore from '@store/setting'

// for global use
export let i18n: any
export let currentLang = ref<SUPPORT_LOCALES>(SUPPORT_LOCALES['zh'])
// for setup
export function setupI18n() {
  const options: VueI18nOptions = {
    fallbackLocale: 'zh',
    messages: { zh, en, ja }
  }

  i18n = createI18n(options)
  setI18nLanguage(currentLang.value)
  return i18n
}

export function setI18nLanguage(locale: SUPPORT_LOCALES) {
  try {
    const setting = useSettingStore()
    if (setting.lang !== locale) setting.lang = locale
  } catch (error) {}
  currentLang.value = locale
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale
  } else {
    i18n.global.locale.value = locale
  }
  /**
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  document.querySelector('html')?.setAttribute('lang', locale)
}
