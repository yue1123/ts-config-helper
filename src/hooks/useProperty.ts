import { getValueByPath, parsePath } from '@utils'
import { tsconfigSchema, schemaLangMap } from '@schema'
import { shallowRef, watch, watchEffect } from 'vue'
import { currentLang } from '@i18n'
import type { Options } from '@types'

export function useProperty() {
  const property = shallowRef()
  const allFlatPropertyKeysMap = shallowRef(new Map())
  const allFlatPropertyKeys: string[] = []
  function getOptions(rawData: any, keys: string[]): { res: Options[]; allFlatKeys: string[] } {
    let tempKeys = [...keys]
    let allFlatKeys: string[] = []
    let res = Object.keys(rawData).map((key) => {
      let ele = rawData[key]
      const refProperty = ele.allOf
        ? ele.allOf.map(({ $ref }: Record<string, any>) =>
            getValueByPath(tsconfigSchema, parsePath($ref, '/'))
          )
        : null
      if (refProperty) {
        refProperty.map((item: Record<string, any>) => {
          ele = Object.assign(ele, item)
        })
      }
      let children: Options[] = []
      if (ele.properties) {
        tempKeys.push(key)
        allFlatKeys.push(key)
        // deep get
        const { res, allFlatKeys: _allFlatKeys } = getOptions(ele.properties, tempKeys)
        children = res
        allFlatKeys.push.apply(allFlatKeys, _allFlatKeys)
      }
      let flatKeys = [...tempKeys, key].join('.')
      allFlatKeys.push(flatKeys)
      return {
        ...ele,
        label: key,
        key: flatKeys,
        children
      }
    })
    return { allFlatKeys, res }
  }
  watchEffect(
    () => {
      allFlatPropertyKeys.length = 0
      let schema = (schemaLangMap as any)[currentLang.value]
      if (!schema) schema = (schemaLangMap as any)['en']
      const allDefinitions: Record<string, any> = schema.definitions
      Reflect.deleteProperty(allDefinitions, '//')
      property.value = Object.keys(allDefinitions).reduce<Options[]>((_values, key) => {
        if (allDefinitions[key].properties) {
          const { res, allFlatKeys } = getOptions(allDefinitions[key].properties, [])
          allFlatPropertyKeys.push.apply(allFlatPropertyKeys, allFlatKeys)
          allFlatKeys.forEach((key) => allFlatPropertyKeysMap.value.set(key, true))
          _values.push.apply(_values, res)
        }
        return _values
      }, [])
    },
    {
      flush: 'sync'
    }
  )
  return { property, allFlatPropertyKeysMap, allFlatPropertyKeys }
}
