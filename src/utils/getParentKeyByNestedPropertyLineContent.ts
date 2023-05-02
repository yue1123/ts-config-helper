import { propertyLineReg } from '@constants'
type SearchOpenBrackets = '{' | '[' | '}' | ']'
export function getParentKeyByNestedPropertyLineContent(
  cursorBeforeLineContentJson: string,
  cursorLineContentJson: string
) {
  const trimContent = cursorLineContentJson.trim()
  if (trimContent.includes('}')) return null
  // 当前行是否是属性行
  const isPropertyLine = propertyLineReg.test(cursorLineContentJson)
  const searchOpenBrackets: Partial<Record<SearchOpenBrackets, boolean>> = {
    '{': true,
    '[': true
  }
  const searchCloseBrackets: Partial<Record<SearchOpenBrackets, boolean>> = {
    '}': true,
    ']': true
  }
  let keys = []
  if (isPropertyLine) {
    let res = cursorLineContentJson.match(propertyLineReg)
    if (res && res[1]) {
      keys.push(res[1])
    }
    // 点击行不是位于数组中
    searchOpenBrackets['['] = false
    searchCloseBrackets[']'] = false
  }
  const jsonArr = cursorBeforeLineContentJson.split('')
  let closeBrackets = 0
  for (let i = jsonArr.length - 1; i > 0; i--) {
    const bracket = jsonArr[i] as SearchOpenBrackets
    if (searchCloseBrackets[bracket]) {
      closeBrackets += 1
    } else if (searchOpenBrackets[bracket]) {
      if (closeBrackets > 0) {
        closeBrackets--
        continue
      }
      let keyLetter = []
      while (jsonArr[i] !== '"') i--
      i--
      while (jsonArr[i] !== '"') {
        keyLetter.unshift(jsonArr[i])
        i--
      }
      keys.unshift(keyLetter.join(''))
    }
  }
  return keys
}
