import { describe, expect, test } from '@jest/globals'
import { deepFreeze, filterKeys } from '../../../src/utils/etc'

describe(`deepFreeze`, () => {
  test(`deepFreeze(undefined)`, () => {
    expect(Object.isFrozen(deepFreeze(undefined))).toBe(true)
  })
  test(`deepFreeze({})`, () => {
    expect(Object.isFrozen(deepFreeze({}))).toBe(true)
  })
  test(`deepFreeze({ foo: 'bar' })`, () => {
    expect(Object.isFrozen(deepFreeze({ foo: 'bar' }))).toBe(true)
  })
  test(`deepFreeze({ foo: { bar: 'zar' } })`, () => {
    const o = deepFreeze({ foo: { bar: 'zar' } }) as any
    expect(Object.isFrozen(o) && Object.isFrozen(o.foo) && Object.isFrozen(o.foo.bar)).toBe(true)
  })
})

describe(`filterKeys`, () => {
  test(`filterKeys(undefined, undefined)`, () => {
    expect(filterKeys(undefined, undefined)).toBe(undefined)
  })
  test(`filterKeys(undefined, {})`, () => {
    expect(filterKeys(undefined, {})).toBe(undefined)
  })
  test(`filterKeys({}, undefined)`, () => {
    expect(filterKeys({}, undefined)).toEqual({})
  })
  test(`filterKeys({}, {})`, () => {
    expect(filterKeys({}, {})).toEqual({})
  })
  test(`filterKeys({ foo: 2, bar: 3, zar: 5 }, {})`, () => {
    const o = { foo: 2, bar: 3, zar: 5 }
    expect(filterKeys(o, {})).toEqual(o)
  })
  test(`filterKeys({ foo: 2, bar: 3, zar: 5 }, { include: ['foo'] })`, () => {
    const o = { foo: 2, bar: 3, zar: 5 }
    expect(filterKeys(o, { include: ['foo'] })).toEqual({ foo: 2 })
  })
  test(`filterKeys({ foo: 2, bar: 3, zar: 5 }, { exclude: ['foo'] })`, () => {
    const o = { foo: 2, bar: 3, zar: 5 }
    expect(filterKeys(o, { exclude: ['foo'] })).toEqual({ bar: 3, zar: 5 })
  })
  test(`filterKeys({ foo: 2, bar: 3, zar: 5 }, { include: ['foo'], exclude: ['zar'] })`, () => {
    const o = { foo: 2, bar: 3, zar: 5 }
    expect(filterKeys(o, { include: ['foo'], exclude: ['zar'] })).toEqual({ foo: 2 })
  })
})
