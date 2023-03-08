export interface DiffRes {
  delete: any[]
  add: any[]
}
export function diffArray(newValue: any[], oldValue: any[]): DiffRes {
  const oldValueMap = oldValue.reduce((map, current) => {
    map[current] = true
    return map
  }, Object.create(null))

  const res: DiffRes = {
    delete: [],
    add: []
  }

  newValue.forEach((item) => {
    if (!oldValueMap[item]) {
      res.add.push(item)
    }
    // help filter delete item
    oldValueMap[item] = false
  })
  for (const item in oldValueMap) {
    oldValueMap[item] && res.delete.push(item)
  }
  return res
}
