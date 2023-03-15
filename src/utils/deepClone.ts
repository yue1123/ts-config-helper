export function deepClone(target: Record<string, any> | any[]) {
  return JSON.parse(JSON.stringify(target))
}
