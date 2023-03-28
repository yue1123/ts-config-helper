export function deepClone(target: Record<string, any> | any[] | void) {
  return JSON.parse(JSON.stringify(target))
}
