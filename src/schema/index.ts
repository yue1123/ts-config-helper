import tsconfigSchema from './_tsconfig.json'
import zh from './description.zh.json'
import en from './description.json'

const schemaLangMap = {
  en: tsconfigSchema
}

const descriptionMap = {
  en,
  zh
}

export { schemaLangMap, tsconfigSchema, descriptionMap }
