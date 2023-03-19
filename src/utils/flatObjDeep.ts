// export type Flatten<T extends Record<string, any> = {}> = {
//   [K in keyof T]: T[K] extends Record<string, any>
//     ? { [P in keyof Flatten<T[K]> as `${K & string}/${P & string}`]: Flatten<T[K]>[P] }
//     : { [P in keyof T]: T[P] }
// }[keyof T]
// : Flatten<T>
export function flatObjWithDepthControl<T extends Record<string, any> = {}>(
  obj: T,
  isMaxFlattenDepth: (key: string) => boolean
) {
  function flatHelper<T extends Record<string, any> = {}>(
    obj: T,
    parentKeys: string[],
    res: Record<any, any> = {}
  ) {
    let keys = Object.keys(obj)
    let currentKey
    while ((currentKey = keys.shift())) {
      let ele = obj[currentKey]
      let keys = parentKeys.concat(currentKey)
      let keysString = keys.join('.')
      if (isMaxFlattenDepth(keysString)) {
        res[parentKeys.join('.')] = obj
        break
      } else if (typeof ele === 'object' && !Array.isArray(ele) && Object.keys(ele).length !== 0) {
        res = Object.assign(res, flatHelper(ele, keys, {}))
      } else {
        res[keysString] = ele
      }
    }
    return res
  }
  return flatHelper(obj, [], {})
}