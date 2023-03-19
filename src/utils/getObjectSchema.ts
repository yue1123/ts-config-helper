export function getObjectSchema(property: Record<string, any>) {
  let schema: Record<string, any> = {}
  let itemProperty = property.items.properties
  Object.keys(itemProperty).forEach((key) => {
    let ele = itemProperty[key]
    schema[key] = ele.type === 'object' ? {} : ele.type === 'array' ? [] : ''
  })
  return schema
}
