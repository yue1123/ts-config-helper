/**
 *
 * @param {(...arg) => void} fn 回调函数
 * @param {number} wait 等待时间
 * @param {boolean} immediate 是否立即出发
 */
export function debounce(fn: (...arg: any[]) => any, wait: number, immediate: boolean = false) {
  if (typeof fn !== 'function') throw new Error('must have a callback fn')
  if (typeof wait === 'boolean') immediate = wait
  if (wait === undefined || typeof wait !== 'number') wait = 300
  let timer: null | NodeJS.Timeout = null
  return function proxy(this: any, ...arg: any[]) {
    let _this = this
    let _immediate = immediate && !timer
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      !immediate && fn.apply(_this, arg)
      timer = null
    }, wait)
    _immediate && fn.apply(_this, arg)
  }
}
