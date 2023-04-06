const schema = require('../schema/_tsconfig.json')
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
    if (ele.allOf) {
      const refProperty = ele.allOf.map(({ $ref }) => getValueByPath(schema, parsePath($ref, '/')))
      refProperty &&
        refProperty.map((item) => {
          ele = Object.assign(ele, item)
        })
    }
    if (ele.properties) {
      tempKeys.push(key)
      getOptions(ele.properties, map, tempKeys)
    }
    let flatKeys = [...new Set([...tempKeys, key])].join('.')
    // https://github.com/microsoft/TypeScript-Website/blob/v2/packages/tsconfig-reference/scripts/schema/result/schema.json
    let markdownDesc = rawData[key].markdownDescription

    let link
    if (markdownDesc) {
      let res = markdownDesc.split('https')
      link = res[1] ? `https${res[1]}` : ''
    }
    map[flatKeys] = {
      message: rawData[key].description,
      link: link
    }
  })
  return map
}

const allDefinitions = schema.definitions
Reflect.deleteProperty(allDefinitions, '//')
const res = Object.keys(allDefinitions).reduce((map, key) => {
  if (allDefinitions[key].properties) {
    const res1 = getOptions(allDefinitions[key].properties)
    map = { ...map, ...res1 }
  }
  return map
}, Object.create(null))

fs.writeFileSync(
  path.resolve(process.cwd(), './src/schema/description.json'),
  JSON.stringify(res, null, 2)
)
