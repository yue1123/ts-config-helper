import { describe, it, expect } from 'vitest'

import { initValueByPath } from '../index'

describe('initValueByPath', () => {
  it('a.b.c', () => {
    const target = {}
    expect(initValueByPath(target, 'a.b.c', 'testValue')).toEqual({
      a: {
        b: {
          c: 'testValue'
        }
      }
    })
  })

  it('a.b.c.d.e.f', () => {
    const target = {}
    expect(initValueByPath(target, 'a.b.c.d.e.f', 'testValue')).toEqual({
      a: {
        b: {
          c: {
            d: {
              e: {
                f: 'testValue'
              }
            }
          }
        }
      }
    })
  })
})
