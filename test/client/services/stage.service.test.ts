import { describe, expect, test } from '@jest/globals'
import P from '../../aid/prime-numbers'
import { ConfigService } from '../../../src/client/services/config.service'
import { StageService } from '../../../src/client/services/stage.service'

describe(`StageService`, () => {
  test(`#0`, () => {
    const logs: any[] = []
    const $canvas = { width: 0, height: 0, style: {} } as any
    const ctx = {
      _scaleX: 0,
      _scaleY: 0,
      imageSmoothingEnabled: false,
      scale(x: number, y: number): void {
        this._scaleX = x
        this._scaleY = y
      },
      snapshot(): any {
        return {
          scale: { x: this._scaleX, y: this._scaleY },
          imageSmoothingEnabled: this.imageSmoothingEnabled,
        }
      },
    } as any
    const config = new ConfigService()
    const service = new StageService({
      $canvas: $canvas as HTMLCanvasElement,
      ctx: ctx as CanvasRenderingContext2D,
      config,
    })
    config.stage = { width: P[0], height: P[1], scale: P[2], smoothing: true, cursor: `test` }
    service.update()
    logs.push($canvas)
    logs.push(ctx.snapshot())
    expect(logs).toEqual([
      { width: P[0] * P[2], height: P[1] * P[2], style: { cursor: 'test' } },
      { scale: { x: P[2], y: P[2] }, imageSmoothingEnabled: true }
    ])
  })
})
