// https://github.com/microsoft/node-jsonc-parser#readme
// const { parse, format, modify, applyEdits, stringify } = require('jsonc-parser')
// const {  compare, applyOperation, applyPatch } = require('fast-json-patch')
// const { parse, assign, stringify } = require('comment-json')

const { stringify, parse } = require('json5')

let json = `{
  // this is files
  /* this is files */
  "files": [],
  // this is files
  "age": 123,
  // this is files
  "user":{
    "name": "张三"
  }
}
`

const json1 = `
// after-all
{
  // this is files
  "files": [],
  "age": 123,
  "user":{
    "name": "李四"
  },
  "user1":{
    "name": "李四1"
  }
}
`

// const jsonObj = parse(json, undefined, false)
// const json1Obj = parse(json1)
// // console.log(jsonObj)
// console.log(jsonObj)
// console.log(stringify(jsonObj, null, 2))

// console.log(stringify(assign(jsonObj, json1Obj), null, 2))
let a = parse(json)
// const patch = compare(a, parse(json1))
// console.log(patch)
// console.log('---------\n', applyPatch(a, patch).newDocument, '\n---------')
// let edits = []
console.log(a)
console.log(stringify(a))
// patch.forEach(({ path, value }) => {
//   json = applyEdits(json, modify(json, path.split('/').filter(Boolean), value, {}))
//   // edits.push.apply(edits)
// })
// console.log(edits)
// console.log(parse(json))
// console.log(edits)
// const formatPatch = format(json, undefined, {
//   tabSize: 2
//   // insertSpaces: true,
//   // insertFinalNewline: true,
//   // keepLines: true
// })

// console.log(formatPatch, '')
// json = applyEdits(json, formatPatch)
// console.log(json)
