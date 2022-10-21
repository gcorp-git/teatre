import { describe, expect, test } from '@jest/globals'
import P from '../../aid/prime-numbers'
import { ERROR, IDraft, RendererService, TYPE } from '../../../src/client/services/renderer.service'

function createProxy(name: string, logs: any[]): unknown {
  return new Proxy({}, {
    get(target, prop, receiver) {
      return (...args: any) => logs.push([name, 'call', prop, args])
    },
    set(target, prop, value, receiver) {
      logs.push([name, 'set', prop, value])
      return true
    }
  }) as CanvasRenderingContext2D
}

describe(`RendererService`, () => {
  const logs: any[] = []
  const ctxMain = createProxy('main', logs) as CanvasRenderingContext2D
  const ctxDraft = createProxy('draft', logs) as CanvasRenderingContext2D
  const service = new RendererService()
  const images: HTMLImageElement[] = [
    { width: P[4], height: P[5] } as HTMLImageElement,
    { width: P[22], height: P[23] } as HTMLImageElement,
  ]
  const draft: IDraft = {
    $canvas: { width: P[2], height: P[3] } as HTMLCanvasElement,
    ctx: ctxDraft,
  }
  const draftBuffer: any[] = [
    [0, ['fillStyle', 'red']],
    ['fillRect', [P[28], P[29], P[30], P[31]]],
  ]

  test(`#0`, () => {
    service.render({
      ctx: ctxMain,
      width: P[0],
      height: P[1],
      buffer: [
        [TYPE.IMAGE, 0, 0, 0],
        [TYPE.IMAGE, 0, [P[6], P[7], P[8], P[9]], 0],
        [TYPE.IMAGE, 0, 0, [P[10], P[11], P[12], P[13]]],
        [TYPE.IMAGE, 0, [P[14], P[15], P[16], P[17]], [P[18], P[19], P[20], P[21]]],
        [TYPE.IMAGE, 1, 0, 0],

        [TYPE.SCREEN, [[TYPE.IMAGE, 0, 0, 0]], 0, 0],
        [TYPE.SCREEN, [[TYPE.IMAGE, 0, 0, 0]], [P[6], P[7], P[8], P[9]], 0],
        [TYPE.SCREEN, [[TYPE.IMAGE, 0, 0, 0]], 0, [P[10], P[11], P[12], P[13]]],
        [TYPE.SCREEN, [[TYPE.IMAGE, 0, 0, 0]], [P[14], P[15], P[16], P[17]], [P[18], P[19], P[20], P[21]]],

        [TYPE.DRAFT, draftBuffer, [P[24], P[25], P[26], P[27]], 0],
      ],
      images,
      draft,
    })

    expect(logs).toEqual([
      ['main', 'call', 'clearRect', [0, 0, P[0], P[1]]],

      ['main', 'call', 'drawImage', [images[0], 0, 0, P[4], P[5], 0, 0, P[4], P[5]]],
      ['main', 'call', 'drawImage', [images[0], P[6], P[7], P[8], P[9], 0, 0, P[8], P[9]]],
      ['main', 'call', 'drawImage', [images[0], 0, 0, P[4], P[5], P[10], P[11], P[12], P[13]]],
      ['main', 'call', 'drawImage', [images[0], P[14], P[15], P[16], P[17], P[18], P[19], P[20], P[21]]],
      ['main', 'call', 'drawImage', [images[1], 0, 0, P[22], P[23], 0, 0, P[22], P[23]]],

      ['main', 'call', 'drawImage', [images[0], 0, 0, P[4], P[5], 0, 0, P[4], P[5]]],
      ['main', 'call', 'drawImage', [images[0], 0, 0, P[4], P[5], 0, 0, P[4], P[5]]],
      ['main', 'call', 'drawImage', [images[0], 0, 0, P[4], P[5], 0, 0, P[4], P[5]]],
      ['main', 'call', 'drawImage', [images[0], 0, 0, P[4], P[5], 0, 0, P[4], P[5]]],

      ['draft', 'call', 'clearRect', [0, 0, P[26], P[27]]],
      ['draft', 'set', 'fillStyle', ['red']],
      ['draft', 'call', 'fillRect', [P[28], P[29], P[30], P[31]]],
      ['main', 'call', 'drawImage', [draft.$canvas, P[24], P[25], P[26], P[27], 0, 0, P[26], P[27]]],
    ])
  })
  test(`#1`, () => {
    const op = () => {
      service.render({
        ctx: ctxMain,
        width: 0,
        height: 0,
        buffer: [
          [-1, 0, 0, 0],
        ],
        images,
        draft,
      })
    }

    expect(op).toThrow(ERROR.INCORRECT_SPRITE_TYPE)
  })
  test(`#2`, () => {
    const op = () => {
      service.render({
        ctx: ctxMain,
        width: 0,
        height: 0,
        buffer: [
          [TYPE.IMAGE, -1, 0, 0],
        ],
        images,
        draft,
      })
    }

    expect(op).toThrow(ERROR.INCORRECT_SPRITE_IMAGE)
  })
  test(`#3`, () => {
    const op = () => {
      service.render({
        ctx: ctxMain,
        width: 0,
        height: 0,
        buffer: [
          [TYPE.DRAFT, draftBuffer, 0, 0],
        ],
        images,
        draft,
      })
    }

    expect(op).toThrow(ERROR.INCORRECT_DRAFT_SRC)
  })
})
