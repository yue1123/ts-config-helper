import type { SUPPORT_LOCALES } from '@constants'
import tsconfigSchema from './_tsconfig.json'
import zh from './description.zh.json'
import en from './description.json'

const schemaLangMap = {
  en: tsconfigSchema
}

const descriptionMap: Record<SUPPORT_LOCALES, any> = {
  en,
  zh,
  ja: en
}

export { schemaLangMap, tsconfigSchema, descriptionMap }
