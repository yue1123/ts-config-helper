import { describe, expect, it } from 'vitest'
import { deletePropertyByPath } from '../deletePropertyByPath'

describe('deletePropertyByPath', () => {
  it('do not bubble up remove', () => {
    const target = {
      a: {
        b: {
          c: 'testValue'
        }
      }
    }
    expect(deletePropertyByPath(target, ['a', 'b', 'c'], false)).toEqual({ a: { b: {} } })
  })
  it('do bubble up remove', () => {
    const target = {
      a: {
        b: {
          c: 'testValue'
        }
      }
    }
    expect(deletePropertyByPath(target, ['a', 'b', 'c'])).toEqual({})
  })
})
