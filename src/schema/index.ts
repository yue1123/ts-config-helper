import tsconfigSchema from './_tsconfig.json'
import tsconfigZhCNSchema from './_tsconfig.zh.json'

const schemaLangMap = {
  'en-US': tsconfigSchema,
  zh_cn: tsconfigZhCNSchema
}

export { schemaLangMap, tsconfigSchema, tsconfigZhCNSchema }
