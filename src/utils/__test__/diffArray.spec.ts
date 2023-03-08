import { describe, it, expect } from 'vitest'
import { diffArray } from '../diffArray'

describe('diffArray', () => {
  it('add new item', () => {
    const newValue = ['123', 'add']
    const oldValue = ['123']
    expect(diffArray(newValue, oldValue)).toEqual({
      add: ['add'],
      delete: []
    })
  })

  it('delete item', () => {
    const oldValue = ['123', 'deleted']
    const newValue = ['123']
    expect(diffArray(newValue, oldValue)).toEqual({
      add: [],
      delete: ['deleted']
    })
  })

  it('delete items and add items', () => {
    const oldValue = ['deleted1', 'deleted2', 'value']
    const newValue = ['add1', 'add2', 'value']
    expect(diffArray(newValue, oldValue)).toEqual({
      add: ['add1', 'add2'],
      delete: ['deleted1', 'deleted2']
    })
  })
})
