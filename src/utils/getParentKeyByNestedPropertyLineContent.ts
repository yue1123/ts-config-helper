import { propertyLineReg } from '@constants'
import { isLetter } from './isLetter'
import { isDash } from './isDash'
type SearchOpenBrackets = '{' | '[' | '}' | ']'

const bracketsPairMap: Partial<Record<SearchOpenBrackets, string>> = {
  '{': '}',
  '[': ']'
}
export function getParentKeyByNestedPropertyLineContent(
  cursorBeforeLineContentJson: string,
  cursorLineContentJson: string
) {
  const trimContent = cursorLineContentJson.trim()
  if (trimContent === '}') return null
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
  const keys = []
  if (isPropertyLine) {
    let res = cursorLineContentJson.match(propertyLineReg)
    res && keys.push(res[1])
    // 点击行不是位于数组中
    searchOpenBrackets['['] = false
    searchCloseBrackets[']'] = false
  } else {
    // 不是属性行, 就把光标行内容也算上, 帮组括号运算
    // cursorBeforeLineContentJson += cursorLineContentJson
  }
  const jsonArr = cursorBeforeLineContentJson.split('')
  let bracketsStack: SearchOpenBrackets[] = []
  for (let i = jsonArr.length - 1; i > 0; i--) {
    const element = jsonArr[i] as SearchOpenBrackets
    if (searchCloseBrackets[element]) {
      bracketsStack.push(element)
    } else if (searchOpenBrackets[element]) {
      const last = bracketsStack.pop()
      if (last === bracketsPairMap[element]) continue
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
  return keys.length ? keys.join('.') : null
}
