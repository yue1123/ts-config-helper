import { describe, it, expect } from 'vitest'

import { parsePath } from '../index'

describe('parseRefPath', () => {
  it('one level', () => {
    expect(parsePath('#/definitions/tsNodeModuleTypes')).toEqual([
      'definitions',
      'tsNodeModuleTypes'
    ])
  })
  it('deep level', () => {
    expect(parsePath('#/definitions/compilerOptionsDefinition/properties/compilerOptions')).toEqual(
      ['definitions', 'compilerOptionsDefinition', 'properties', 'compilerOptions']
    )
  })
})
