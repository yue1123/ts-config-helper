/**
 * delete object property by given path
 * @param target target object
 * @param path property path
 * @param bubbleDelete bubble up remove empty object
 */
export function deletePropertyByPath(
  target: Record<string, any>,
  path: string[],
  bubbleDelete: boolean = true
) {
  let _target = target
  let currentKey
  let cacheTargetStack = []
  let valuePath = path.pop()
  while (_target && (currentKey = path.shift())) {
    cacheTargetStack.push(_target)
    _target = _target[currentKey]
  }
  Reflect.deleteProperty(_target, valuePath!)
  if (bubbleDelete) {
    for (let i = cacheTargetStack.length - 1; i >= 0; i--) {
      const element = cacheTargetStack[i]
      const keys = Object.keys(element)
      keys.forEach((key) => {
        let ele = element[key]
        if (typeof ele === 'object' && !Object.keys(element[key]).length) {
          Reflect.deleteProperty(element, key)
        }
      })
    }
  }
  return target
}
