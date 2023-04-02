const schema = require('./_tsconfig.json')
const fs = require('fs')
const path = require('path')

function parsePath(path, splitter) {
  if (splitter === void 0) {
    splitter = '.'
  }
  return path.replace('#/', '').split(splitter)
}
function getValueByPath(target, path) {
  var currentPath
  while (target && (currentPath = path.shift())) {
    target = target[currentPath]
  }
  return target
}

function getOptions(rawData, map = Object.create(null), keys = []) {
  let tempKeys = [...keys]
  Object.keys(rawData).map((key) => {
    let ele = rawData[key]
    const refProperty = ele.allOf
      ? ele.allOf.map(({ $ref }) => getValueByPath(schema, parsePath($ref, '/')))
      : null
    if (refProperty) {
      refProperty.map((item) => {
        ele = Object.assign(ele, item)
      })
    }
    if (ele.properties) {
      tempKeys.push(key)
      getOptions(ele.properties, map, tempKeys)
    }
    let flatKeys = [...tempKeys, key].join('.')
    map[flatKeys] = rawData[key].markdownDescription || rawData[key].description
  })
  return map
}

const allDefinitions = schema.definitions
Reflect.deleteProperty(allDefinitions, '//')
const res = Object.keys(allDefinitions).reduce((map, key) => {
  if (allDefinitions[key].properties) {
    const res1 = getOptions(allDefinitions[key].properties)
    // allFlatPropertyKeys.push.apply(allFlatPropertyKeys, allFlatKeys)
    // allFlatKeys.forEach((key) => allFlatPropertyKeysMap.value.set(key, true))
    // _values.push.apply(_values, res)
    map = { ...map, ...res1 }
  }
  return map
}, Object.create(null))

fs.writeFileSync(
  path.resolve(process.cwd(), './src/schema/description.json'),
  JSON.stringify(res, null, 2)
)
