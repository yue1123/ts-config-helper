import { expect, test, describe } from 'vitest'

import { getObjectSchema } from '../getObjectSchema'

describe('getObjectSchema', () => {
  test('simple', () => {
    expect(
      getObjectSchema({
        items: {
          type: 'object',
          description: 'Project reference.',
          properties: {
            path: {
              type: 'string',
              description: 'Path to referenced tsconfig or to folder containing tsconfig.'
            },
            path1: {
              type: 'object',
              description: 'Path to referenced tsconfig or to folder containing tsconfig.'
            }
          }
        }
      })
    ).toEqual({
      path1: {},
      path: ''
    })
  })
})
