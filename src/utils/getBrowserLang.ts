import type { SUPPORT_LOCALES } from '@constants'

export const getBrowserLang = function () {
  let browserLang = (
    navigator.language ? navigator.language : (navigator as any).browserLanguage
  ).toLowerCase()
  // base lang
  let lang: keyof typeof SUPPORT_LOCALES = 'en'
  if (browserLang === 'zh-cn' || browserLang === 'zh') {
    lang = 'zh'
  } else if (browserLang === 'ja') {
    lang = 'ja'
  }
  return lang
}
