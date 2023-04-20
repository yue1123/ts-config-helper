import { nextTick, ref } from 'vue'
import { createI18n } from 'vue-i18n'
import { SUPPORT_LOCALES } from '@constants'
import useSettingStore from '@store/setting'
import zh from '@i18n/modules/zh.json'

type LocaleMessageSchema = typeof zh
const loadedLocaleMap = new Map<SUPPORT_LOCALES, LocaleMessageSchema>()

// for global use
export let i18n: any
export let currentLang = ref<SUPPORT_LOCALES>(SUPPORT_LOCALES['zh'])
// for setup
export async function setupI18n() {
  i18n = createI18n<[LocaleMessageSchema], SUPPORT_LOCALES>({
    legacy: false,
    fallbackLocale: 'en',
    messages: { zh }
  })
  await setI18nLanguage(currentLang.value)
  return i18n
}

export async function setI18nLanguage(locale: SUPPORT_LOCALES) {
  try {
    await loadLocaleMessages(locale)
    const setting = useSettingStore()
    if (setting.lang !== locale) setting.lang = locale
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
  } catch (error) {}
}
export async function loadLocaleMessages(locale: SUPPORT_LOCALES) {
  if (!loadedLocaleMap.get(locale)) {
    // load locale messages with dynamic import
    const messages = await import(`./modules/${locale}.json`)
    // set locale and locale message
    i18n.global.setLocaleMessage(locale, messages.default)
  }

  return nextTick()
}
