// export type Flatten<T extends Record<string, any> = {}> = {
//   [K in keyof T]: T[K] extends Record<string, any>
//     ? { [P in keyof Flatten<T[K]> as `${K & string}/${P & string}`]: Flatten<T[K]>[P] }
//     : { [P in keyof T]: T[P] }
// }[keyof T]
// : Flatten<T>
export function flatObjDeep<T extends Record<string, any> = {}>(obj: T) {
  return flatHelper(obj, [])
}

function flatHelper<T extends Record<string, any> = {}>(
  obj: T,
  parentKeys: string[],
  res: Record<any, string> = {}
) {
  let keys = Object.keys(obj)
  let currentKey
  while ((currentKey = keys.shift())) {
    let ele = obj[currentKey]
    let keys = parentKeys.concat(currentKey)
    if (typeof ele === 'object' && !Array.isArray(ele)) {
      res = Object.assign(res, flatHelper(ele, keys))
    } else {
      res[keys.join('/')] = ele
    }
  }
  return res
}
