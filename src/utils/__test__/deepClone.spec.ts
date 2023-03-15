import { it, describe, expect } from 'vitest'
import { deepClone } from '../deepClone'

describe('deep clone',() =>{
  it('object deep clone',() =>{
    const target = {
      a: {
        b: {
          c: 123
        }
      }
    }
    const res = deepClone(target)
    res.a.b.c = 456
    expect(target.a.b.c).toBe(123)
    expect(res.a.b.c).toBe(456)
  })
  it('array deep clone', () => {
    const target = [1, 2, 3]
    const res = deepClone(target)
    res[2] = 456
    expect(target[2]).toBe(3)
    expect(res[2]).toBe(456)
  })
})