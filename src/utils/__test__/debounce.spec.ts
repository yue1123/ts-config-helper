import { describe, expect, it, vi } from 'vitest'
import { debounce } from '../debounce'

describe('debounce', () => {
  it('immediate', (done) => {
    const method = {
      callFn() {
        console.log('called ')
      }
    }
    const callFnSpy = vi.spyOn(method, 'callFn')
    const fn = debounce(() => {
      method.callFn()
    }, 300)

    fn()
    fn()
    fn()
    setTimeout(() => {
      expect(callFnSpy).toHaveBeenCalledTimes(1)
    }, 500)
  })
})
