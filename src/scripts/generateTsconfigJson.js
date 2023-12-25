// @ts-check
const fs = require('fs')
const path = require('path')

// fetch from https://json.schemastore.org/tsconfig.json
async function fetchTsconfigJson() {
  const res = await fetch('https://json.schemastore.org/tsconfig.json')
  const data = await res.json()
  return data
}

// write to src/schema/_tsconfig.json
async function writeTsconfigJson() {
  const data = await fetchTsconfigJson()
  fs.writeFileSync(
    path.resolve(process.cwd(), './src/schema/_tsconfig.json'),
    JSON.stringify(data, null, 2)
  )
}

writeTsconfigJson()
