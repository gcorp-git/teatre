import { describe, expect, test } from '@jest/globals'
import { ConfigService } from '../../../src/client/services/config.service'

describe(`ConfigService`, () => {
  test(`#0`, () => {
    const logs: any[] = []
    const service = new ConfigService()
    logs.push(Object.isFrozen(service.title))
    logs.push(Object.isFrozen(service.stage))
    logs.push(Object.isFrozen(service.assets))
    logs.push(Object.isFrozen(service.assets.images))
    logs.push(service.title)
    logs.push(service.stage)
    logs.push(service.assets)
    service.title = 'test'
    logs.push(service.title)
    service.stage = {}
    logs.push(service.stage)
    service.stage = { width: 320, height: 240 }
    logs.push(service.stage)
    service.stage = { scale: 2, smoothing: true, cursor: 'pointer' }
    logs.push(service.stage)
    service.assets = {}
    logs.push(service.assets)
    service.assets = { images: ['test.png'] }
    logs.push(service.assets)
    logs.push(Object.isFrozen(service.title))
    logs.push(Object.isFrozen(service.stage))
    logs.push(Object.isFrozen(service.assets))
    logs.push(Object.isFrozen(service.assets.images))
    expect(logs).toEqual([
      true,
      true,
      true,
      true,
      '',
      { width: 800, height: 600, scale: 1, smoothing: false, cursor: 'default' },
      { images: [] },
      'test',
      { width: 800, height: 600, scale: 1, smoothing: false, cursor: 'default' },
      { width: 320, height: 240, scale: 1, smoothing: false, cursor: 'default' },
      { width: 320, height: 240, scale: 2, smoothing: true, cursor: 'pointer' },
      { images: [] },
      { images: ['test.png'] },
      true,
      true,
      true,
      true,
    ])
  })
})
