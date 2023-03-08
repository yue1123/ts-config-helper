import { describe, it, expect } from 'vitest'

import { getValueByPath } from '../index'

describe('getValueByPath', () => {
  const testObj = {
    a: {
      b: {
        c: {
          name: 123
        }
      }
    }
  }
  it('one level', () => {
    expect(getValueByPath(testObj, ['a'])).toBe(testObj.a)
  })
  it('deep level', () => {
    expect(getValueByPath(testObj, ['a', 'b', 'c'])).toBe(testObj.a.b.c)
  })
})
