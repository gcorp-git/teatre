import { describe, expect, test } from '@jest/globals'
import { DraftBuilder } from '../../../../../src/server/services/stage/render/draft.builder'
import { TYPE } from '../../../../../src/server/services/stage/render/model'

describe(`DraftBuilder`, () => {
  test(`empty`, () => {
    const ri = new DraftBuilder()
    expect(ri.serialize()).toEqual(undefined)
  })
  test(`data`, () => {
    const ri = new DraftBuilder()
    ri.data = [['fillRect', [2, 3, 5, 7]]]
    expect(ri.serialize()).toEqual([TYPE.DRAFT, [['fillRect', [2, 3, 5, 7]]], 0, 0])
  })
  test(`data, src`, () => {
    const ri = new DraftBuilder()
    ri.data = [['fillRect', [2, 3, 5, 7]]]
    ri.src = [11, 13, 17, 19]
    expect(ri.serialize()).toEqual([TYPE.DRAFT, [['fillRect', [2, 3, 5, 7]]], [11, 13, 17, 19], 0])
  })
  test(`data, dest`, () => {
    const ri = new DraftBuilder()
    ri.data = [['fillRect', [2, 3, 5, 7]]]
    ri.dest = [11, 13, 17, 19]
    expect(ri.serialize()).toEqual([TYPE.DRAFT, [['fillRect', [2, 3, 5, 7]]], 0, [11, 13, 17, 19]])
  })
  test(`data, src, dest`, () => {
    const ri = new DraftBuilder()
    ri.data = [['fillRect', [2, 3, 5, 7]]]
    ri.src = [11, 13, 17, 19]
    ri.dest = [23, 29, 31, 37]
    expect(ri.serialize()).toEqual([TYPE.DRAFT, [['fillRect', [2, 3, 5, 7]]], [11, 13, 17, 19], [23, 29, 31, 37]])
  })
  test(`data, src, dest, filters`, () => {
    const ri = new DraftBuilder()
    ri.data = [['fillRect', [2, 3, 5, 7]]]
    ri.src = [11, 13, 17, 19]
    ri.dest = [23, 29, 31, 37]
    const filters = {
      filter: 'grayscale(100%)',
      operation: 'xor',
      rotate: 41,
      scale: { x: 43, y: 47 },
      skew: { x: 53, y: 59 },
    }
    const incorrectFilters = {
      foo: 'rotate(90)',
      bar: { x: 61, y: 67 },
    }
    ri.filters = { ...filters, ...incorrectFilters }
    expect(ri.serialize()).toEqual([TYPE.DRAFT, [['fillRect', [2, 3, 5, 7]]], [11, 13, 17, 19], [23, 29, 31, 37], filters])
  })
  test(`cache is the same`, () => {
    const ri = new DraftBuilder()
    ri.data = [['fillRect', [2, 3, 5, 7]]]
    ri.src = [11, 13, 17, 19]
    ri.dest = [23, 29, 31, 37]
    const filters = {
      filter: 'grayscale(100%)',
      operation: 'xor',
      rotate: 37,
      scale: { x: 41, y: 43 },
      skew: { x: 47, y: 53 },
    }
    const incorrectFilters = {
      foo: 'rotate(90)',
      bar: { x: 59, y: 61 },
    }
    ri.filters = { ...filters, ...incorrectFilters }
    const cache1 = ri.serialize()
    const cache2 = ri.serialize()
    expect(cache1).toBe(cache2)
  })
  test(`cache changes`, () => {
    const caches = []
    const ri = new DraftBuilder()
    caches.push(ri.serialize())
    ri.data = [['fillRect', [2, 3, 5, 7]]]
    caches.push(ri.serialize())
    ri.src = [11, 13, 17, 19]
    caches.push(ri.serialize())
    ri.dest = [23, 29, 31, 37]
    caches.push(ri.serialize())
    const filters = {
      filter: 'grayscale(100%)',
      operation: 'xor',
      rotate: 37,
      scale: { x: 41, y: 43 },
      skew: { x: 47, y: 53 },
    }
    const incorrectFilters = {
      foo: 'rotate(90)',
      bar: { x: 59, y: 61 },
    }
    ri.filters = { ...filters, ...incorrectFilters }
    caches.push(ri.serialize())
    expect(caches).toEqual([
      undefined,
      [TYPE.DRAFT, [['fillRect', [2, 3, 5, 7]]], 0, 0],
      [TYPE.DRAFT, [['fillRect', [2, 3, 5, 7]]], [11, 13, 17, 19], 0],
      [TYPE.DRAFT, [['fillRect', [2, 3, 5, 7]]], [11, 13, 17, 19], [23, 29, 31, 37]],
      [TYPE.DRAFT, [['fillRect', [2, 3, 5, 7]]], [11, 13, 17, 19], [23, 29, 31, 37], filters],
    ])
  })
})
