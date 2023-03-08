import type { SelectOption } from 'naive-ui'

const optionsCache = new Map<string, SelectOption[]>()
export function enumToOptions(_enum: string[], key: string): SelectOption[] {
  let cache = optionsCache.get(key)
  if (cache) return cache
  cache = _enum.map((item) => {
    return {
      label: item,
      value: item
    }
  })
  optionsCache.set(key, cache)
  return cache
}
