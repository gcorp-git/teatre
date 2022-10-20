import { describe, expect, test } from '@jest/globals'
import { ScreenBuilder } from '../../../../../src/server/services/stage/render/screen.builder'
import { TYPE } from '../../../../../src/server/services/stage/render/model'
import { ImageBuilder } from '../../../../../src/server/services/stage/render/image.builder'
import { AssetsImage } from '../../../../../src/server/services/assets/assets-image'

describe(`ScreenBuilder`, () => {
  test(`empty`, () => {
    const ri = new ScreenBuilder()
    expect(ri.serialize()).toEqual(undefined)
  })
  test(`data`, () => {
    const ri = new ScreenBuilder()
    ri.data = [new ImageBuilder({ data: new AssetsImage(2, '', 3, 5) })]
    expect(ri.serialize()).toEqual([TYPE.SCREEN, [[TYPE.IMAGE, 2, 0, 0]], 0, 0])
  })
  test(`data, src`, () => {
    const ri = new ScreenBuilder()
    ri.data = [new ImageBuilder({ data: new AssetsImage(2, '', 3, 5) })]
    ri.src = [7, 11, 13, 17]
    expect(ri.serialize()).toEqual([TYPE.SCREEN, [[TYPE.IMAGE, 2, 0, 0]], [7, 11, 13, 17], 0])
  })
  test(`data, dest`, () => {
    const ri = new ScreenBuilder()
    ri.data = [new ImageBuilder({ data: new AssetsImage(2, '', 3, 5) })]
    ri.dest = [7, 11, 13, 17]
    expect(ri.serialize()).toEqual([TYPE.SCREEN, [[TYPE.IMAGE, 2, 0, 0]], 0, [7, 11, 13, 17]])
  })
  test(`data, src, dest`, () => {
    const ri = new ScreenBuilder()
    ri.data = [new ImageBuilder({ data: new AssetsImage(2, '', 3, 5) })]
    ri.src = [7, 11, 13, 17]
    ri.dest = [19, 23, 29, 31]
    expect(ri.serialize()).toEqual([TYPE.SCREEN, [[TYPE.IMAGE, 2, 0, 0]], [7, 11, 13, 17], [19, 23, 29, 31]])
  })
  test(`data, src, dest, filters`, () => {
    const ri = new ScreenBuilder()
    ri.data = [new ImageBuilder({ data: new AssetsImage(2, '', 3, 5) })]
    ri.src = [7, 11, 13, 17]
    ri.dest = [19, 23, 29, 31]
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
    expect(ri.serialize()).toEqual([TYPE.SCREEN, [[TYPE.IMAGE, 2, 0, 0]], [7, 11, 13, 17], [19, 23, 29, 31], filters])
  })
  test(`cache is the same`, () => {
    const ri = new ScreenBuilder()
    ri.data = [new ImageBuilder({ data: new AssetsImage(2, '', 3, 5) })]
    ri.src = [7, 11, 13, 17]
    ri.dest = [19, 23, 29, 31]
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
    const ri = new ScreenBuilder()
    caches.push(ri.serialize())
    ri.data = [new ImageBuilder({ data: new AssetsImage(2, '', 3, 5) })]
    caches.push(ri.serialize())
    ri.src = [7, 11, 13, 17]
    caches.push(ri.serialize())
    ri.dest = [19, 23, 29, 31]
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
      [TYPE.SCREEN, [[TYPE.IMAGE, 2, 0, 0]], 0, 0],
      [TYPE.SCREEN, [[TYPE.IMAGE, 2, 0, 0]], [7, 11, 13, 17], 0],
      [TYPE.SCREEN, [[TYPE.IMAGE, 2, 0, 0]], [7, 11, 13, 17], [19, 23, 29, 31]],
      [TYPE.SCREEN, [[TYPE.IMAGE, 2, 0, 0]], [7, 11, 13, 17], [19, 23, 29, 31], filters],
    ])
  })
})
