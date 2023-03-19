import { expect, test, describe } from 'vitest'

import { flatObjWithDepthControl } from '../flatObjDeep'

// const a = flatObjDeep()

describe('flatObjDeep', () => {
  test('simple', () => {
    expect(
      flatObjWithDepthControl(
        {
          a: '1',
          b: {
            c: 'test'
          },
          d: {
            e: {
              f: 'ffff'
            }
          }
        },
        () => false
      )
    ).toEqual({
      a: '1',
      'b.c': 'test',
      'd.e.f': 'ffff'
    })
  })
})
