import { parsePath } from './parsePath'

/**
 * init value by path
 * @param target target obj
 * @param path path
 * @param defaultValue
 * @returns target
 * @example initValueByPath({},'a/b/c', 'testValue') ==> { a: { b: { c: 'testValue' } } }
 */
export function initValueByPath(
  target: Record<string, any>,
  path: string,
  defaultValue: any
) {
  const paths = parsePath(path)
  const valuePath = paths.pop() as string
  let currentPath: string | void
  let currentValue: Record<string, any> = target
  while ((currentPath = paths.shift())) {
    let temp = currentValue[currentPath]
    if (!temp) {
      temp = currentValue[currentPath] = {}
    }
    currentValue = temp
  }
  currentValue[valuePath] = defaultValue
  return target
}
