import type { Options, FilterKey } from '@types'
import { deepClone } from '@utils'
import { shallowRef } from 'vue'
import { useSchemaData } from './useSchemaData'
import { filterMap } from '@constants'
/**
 * expand schema data with filter and floatKeyMap
 * @returns
 */
const filterCache = new Map<FilterKey, any[]>()
export async function useSchemaDataWithFilter() {
  const { treeData, allOptionsFlatKeys: keys, allOptionsFlatKeysMap } = await useSchemaData()
  const filterData = shallowRef(treeData)
  const allOptionsFlatKeys = shallowRef(keys)
  function filter(type: FilterKey) {
    if (type === 'all') {
      filterData.value = deepClone(treeData)
      allOptionsFlatKeys.value = keys
    } else {
      let res = filterCache.get(type)
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
            return (filterMap[type] as any)[item.flatKeys]
          }
        })
      }
      allOptionsFlatKeys.value = Object.keys(filterMap[type])

      if (res) return (filterData.value = res)
      res = filterHelper(deepClone(treeData))
      filterData.value = res
      filterCache.set(type, res)
    }
  }
  return {
    filterData,
    allOptionsFlatKeys,
    allOptionsFlatKeysMap,
    filter
  }
}
