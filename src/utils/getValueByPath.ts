export function getValueByPath(target: Record<string, any>, path: string[]) {
  let currentPath
  while (target && (currentPath = path.shift())) {
    target = target[currentPath]
  }
  return target
}
