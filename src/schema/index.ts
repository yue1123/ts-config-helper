import tsconfigSchema from './_tsconfig.json'
import tsconfigZhCNSchema from './_tsconfig.zh.json'

const schemaLangMap = {
  'en': tsconfigSchema,
  zh: tsconfigZhCNSchema
}

export { schemaLangMap, tsconfigSchema, tsconfigZhCNSchema }
