import { letterReg, propertyLineReg } from '@constants'

export function getParentKeyByNestedPropertyLineContent(json: string, lineContent: string) {
  const trimContent = lineContent.trim()
  if (trimContent === '}') return null
  // 截取 lineContent 之前的内容, 用于逆向遍历
  const contentIndex = json.indexOf(trimContent)
  // 当前行是否是属性行
  const isPropertyLine = propertyLineReg.test(lineContent)
  const keys = []
  if (isPropertyLine) {
    let res = lineContent.match(propertyLineReg)
    res && keys.push(res[1])
  }
  for (let i = contentIndex; i > 0; i--) {
    const element = json[i]
    if (element === '{' || (!isPropertyLine && element === '[')) {
      i--
      // 找到第一个字母
      let key = []
      while (!letterReg.test(json[i])) i--
      // 一直运行直到不是字母
      while (letterReg.test(json[i])) {
        key.unshift(json[i])
        i--
      }
      keys.unshift(key.join(''))
    }
  }
  return keys.length ? keys.join('.') : null
}
