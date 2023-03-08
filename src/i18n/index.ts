import { nextTick, ref } from 'vue'
import { createI18n, type VueI18nOptions } from 'vue-i18n'
import { SUPPORT_LOCALES } from '@constants'
import en_US from '@i18n/locale/en-US.json'
import zh_cn from '@i18n/locale/zh_cn.json'

// for global use
export let i18n: any
export let currentLang = ref<SUPPORT_LOCALES>(SUPPORT_LOCALES['zh_cn'])
// for setup
export function setupI18n() {
  const options: VueI18nOptions = {
    fallbackLocale: 'zh_cn',
    messages: { zh_cn, 'en-US': en_US }
  }

  i18n = createI18n(options)
  setI18nLanguage(currentLang.value)
  return i18n
}

export function setI18nLanguage(locale: SUPPORT_LOCALES) {
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
