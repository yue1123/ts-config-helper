import { getValueByPath, parsePath } from '@utils'
import type { Options, schemaConvertResult } from '@types'

/**
 * load tsconfig schema.json and recursive convert it to tree data
 * @param schema
 * @returns
 */
function convertSchemaData(schema: Record<string, any>): schemaConvertResult {
  const schemaDefinitions: Record<string, any> = schema.definitions
  const allOptionsFlatKeys: string[] = []
  const treeData: Options[] = []
  const allOptionsFlatKeysMap = new Map<string, boolean>()
  const recursionHelper = (property: any, keys: string[] = []) => {
    let tempKeys = [...keys]
    let flatKeys: string[] = []
    let res = Object.keys(property).map((key) => {
      let ele = property[key]
      let children: Options[] = []
      let temp = [...tempKeys, key]
      let flatKeyString = temp.join('.')
      // get $ref data
      if (ele.allOf) {
        const refProperty = ele.allOf.map(({ $ref }: Record<string, any>) =>
          getValueByPath(schema, parsePath($ref, '/'))
        )

        if (refProperty) {
          refProperty.map((item: Record<string, any>) => {
            ele = Object.assign(ele, item)
          })
        }
      }

      if (ele.properties) {
        tempKeys.push(key)
        // deep get
        const { res, flatKeys: _flatKeys } = recursionHelper(ele.properties, tempKeys)
        children = res
        Array.prototype.push.apply(flatKeys, _flatKeys)
      }

      flatKeys.push(flatKeyString)
      // remove useless property
      Reflect.deleteProperty(ele, 'description')
      Reflect.deleteProperty(ele, 'markdownDescription')
      return {
        ...ele,
        key,
        flatKeys: flatKeyString,
        parentKeys: tempKeys,
        children
      }
    })
    return { flatKeys, res }
  }

  Reflect.deleteProperty(schemaDefinitions, '//')
  for (const definitionKeys of Object.keys(schemaDefinitions)) {
    let properties = schemaDefinitions[definitionKeys].properties
    if (properties) {
      const { res, flatKeys } = recursionHelper(properties, [])
      Array.prototype.push.apply(allOptionsFlatKeys, flatKeys)
      Array.prototype.push.apply(treeData, res)
    }
  }
  for (const key of allOptionsFlatKeys) {
    allOptionsFlatKeysMap.set(key, true)
  }
  return { treeData, allOptionsFlatKeys, allOptionsFlatKeysMap }
}

let calledData: schemaConvertResult | null = null
export async function useSchemaData() {
  if (!calledData) {
    const [schema] = await Promise.all([
      import('@schema/_tsconfig.json'),
      new Promise<void>((resolve) => {
        setTimeout(resolve, 800)
      })
    ])
    calledData = convertSchemaData(schema)
  }
  return calledData
}
