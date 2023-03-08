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
const typeCache = new Map<string, InputType>()
// get input type
export function getInputType(property: Options): InputType {
  let cache = typeCache.get(property.key)
  if (cache) return cache
  let res = getInputTypeHelper(property)
  typeCache.set(property.key, res as InputType)
  return res
}

// special property
// transpiler
function getInputTypeHelper(property: Options): InputType {
  let { items, type, oneOf, anyOf, key, enum: _enum } = property
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
    } else if ((type === 'string' && !_enum) || (type as string[]).includes('string')) {
      if (anyOf) {
        property.enum = anyOf[0].enum
        return 'select'
      }
      return 'string'
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

// function getTypeByOneOfProperty(oneOf: any) {
//   let types = []
//   if (Array.isArray(oneOf)) {
//     types = oneOf.map((item) => {
//       return item.type
//     })
//   }
//   // 去重,检查是否只有一项,多项则返回异常
//   // if(new Set())
// }

// function analyzeArrayProperty(property) {}
