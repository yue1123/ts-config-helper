import { currentLang } from '@i18n'
import { schemaLangMap, tsconfigSchema } from '@schema'
import type { Options, FilterKey } from '@types'
import { getValueByPath, parsePath, deepClone } from '@utils'
import { shallowRef, watchEffect } from 'vue'

export function useProperty() {
  const property = shallowRef()
  const allFlatPropertyKeysMap = shallowRef(new Map())
  const allFlatPropertyKeys: string[] = []
  const _allFlatPropertyKeys: string[] = []
  let _property: any[] = []
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
        parentKeys: tempKeys,
        children
      }
    })
    return { allFlatKeys, res }
  }
  const filterCache = new Map<FilterKey, any[]>()
  function filter(type: FilterKey, callback: (item: any) => boolean) {
    if (type === 'All') {
      property.value = deepClone(_property)
    } else {
      let res = filterCache.get(type)
      if (res) return res
      const filterHelper = (list: any[]) => {
        return list.filter((item) => {
          if (item.children.length) {
            const res = filterHelper(item.children)
            if (res.length) {
              item.children = res
              return true
            } else {
              return false
            }
          } else {
            return callback(item)
          }
        })
      }
      res = filterHelper(deepClone(_property))
      property.value = res
      filterCache.set(type, res)
    }
  }

  const init = () => {
    _allFlatPropertyKeys.length = allFlatPropertyKeys.length = 0
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
    _property = deepClone(property.value)
  }
  init()
  return { property, filter, allFlatPropertyKeysMap, allFlatPropertyKeys }
}
