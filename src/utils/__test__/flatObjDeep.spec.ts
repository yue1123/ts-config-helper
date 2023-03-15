import { expect, test, describe } from 'vitest'

import { flatObjDeep } from '../flatObjDeep'

// const a = flatObjDeep()

describe('flatObjDeep', () => {
  test('simple', () => {
    expect(
      flatObjDeep({
        a: '1',
        b: {
          c: 'test'
        },
        d: {
          e: {
            f: 'ffff'
          }
        }
      })
    ).toEqual({
      a: '1',
      b: {
        c: 'test'
      },
      d: {
        e: {
          f: 'ffff'
        }
      },
      'd.e': {
        f: 'ffff'
      },
      'b.c': 'test',
      'd.e.f': 'ffff'
    })
  })
})
