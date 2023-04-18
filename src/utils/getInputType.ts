import type { Options } from '../types'

type InputType =
  | 'string'
  | 'boolean'
  | 'number'
  | 'select'
  | 'array'
  | `array.${any}`
  | 'selectAndInput'
  | 'arrayButConvertWhenSingle'
  | 'selectOrInputWithCheck'
  | 'keyValues'
  | 'leafNode'
const typeCache = new Map<string, InputType>()
// get input type
export function getInputType(property: Options): InputType {
  let cache = typeCache.get(property.flatKeys)
  if (cache) return cache
  let res = getInputTypeHelper(property)
  typeCache.set(property.flatKeys, res as InputType)
  return res
}

// special property
// transpiler
function getInputTypeHelper(property: Options): InputType {
  let { items, type, oneOf, anyOf, enum: _enum, properties } = property
  // 分类节点
  if (properties) return 'leafNode'
  if (type) {
    if (type === 'array') {
      if (items.type === 'object') {
        return `array.object`
      } else if (items.anyOf && items.anyOf[0]?.enum) {
        property.enum = items.anyOf[0].enum
        return 'select'
      }
      return 'array'
    } else if (type === 'boolean') {
      return 'boolean'
    } else if (type === 'number') {
      return 'number'
    } else if (type === 'string' && _enum) {
      return 'select'
    } else if (
      (type === 'string' && !_enum) ||
      (type.find && (type as string[]).find((item) => item === 'string'))
    ) {
      if (anyOf) {
        property.enum = anyOf[0].enum
        return 'select'
      }
      return 'string'
    } else if (type === 'object') {
      return 'keyValues'
    }
  } else if (oneOf) {
    return 'arrayButConvertWhenSingle'
  } else if (anyOf) {
    return 'selectOrInputWithCheck'
  } else if (_enum) {
    return 'select'
  }
  // default
  return 'string'
}
