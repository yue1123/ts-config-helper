import { propertyLineReg } from '@constants'
import { isLetter } from './isLetter'
import { isDash } from './isDash'
type SearchOpenBrackets = '{' | '[' | '}' | ']'
export function getParentKeyByNestedPropertyLineContent(json: string, lineContent: string) {
  const trimContent = lineContent.trim()
  if (trimContent === '}') return null
  // 截取 lineContent 之前的内容, 用于逆向遍历
  const contentIndex = json.indexOf(trimContent)
  // 当前行是否是属性行
  const isPropertyLine = propertyLineReg.test(lineContent)
  const searchOpenBrackets: Partial<Record<SearchOpenBrackets, boolean>> = {
    '{': true,
    '[': true
  }
  const searchCloseBrackets: Partial<Record<SearchOpenBrackets, boolean>> = {
    '}': true,
    ']': true
  }
  // 先前的遍历是否存在关闭括号
  let hasCloseBracket = false
  // 先前遍历方括号计数,避免数据括号多次计算
  let squareBracketCount = 0
  const keys = []
  const jsonArr = json.slice(0, contentIndex).split('')
  if (isPropertyLine) {
    let res = lineContent.match(propertyLineReg)
    res && keys.push(res[1])
    // 点击行不是位于数组中
    searchOpenBrackets['['] = false
    searchCloseBrackets[']'] = false
  }
  for (let i = jsonArr.length - 1; i > 0; i--) {
    const element = jsonArr[i] as SearchOpenBrackets

    if (searchOpenBrackets[element]) {
      console.log(element)
      const isSquareBracket = element === '[' || element === ']'
      // if (searchCloseBrackets[element]) hasCloseBracket = true
      if (isSquareBracket) {
        console.log(element, jsonArr[i - 1], jsonArr[i - 4])
        squareBracketCount++
      }
      if (isSquareBracket && squareBracketCount > 1) {
        continue
      }
      // 找到第一个字母
      let key = []
      while (!isLetter(jsonArr[i])) i--
      // 一直运行直到不是字母
      while (isLetter(jsonArr[i]) || isDash(jsonArr[i])) {
        key.unshift(jsonArr[i])
        i--
      }
      keys.unshift(key.join(''))
    }
  }
  console.log(keys)
  return keys.length ? keys.join('.') : null
}
