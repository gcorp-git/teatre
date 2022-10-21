import { describe, expect, test } from '@jest/globals'
import P from '../../aid/prime-numbers'
import { DOMListener } from '../../../src/utils/dom-listener'
import { EventsService } from '../../../src/client/services/events.service'
import { ConfigService } from '../../../src/client/services/config.service'

const $canvas = {
  offsetLeft: P[0],
  offsetTop: P[1],
} as HTMLCanvasElement

global.window = {
  mock: true,
  addEventListener: (event: string, listener: (e: any) => void, options: any): void => void 0,
  removeEventListener: (event: string, listener: (e: any) => void, options: any): void => void 0,
} as any
global.document = {
  mock: true,
  addEventListener: (event: string, listener: (e: any) => void, options: any): void => void 0,
  removeEventListener: (event: string, listener: (e: any) => void, options: any): void => void 0,
} as any

describe(`EventsService`, () => {
  test(`#0`, () => {
    const config = new ConfigService()
    const listener = new DOMListener()
    const service = new EventsService({ $canvas, config, listener })

    listener.emit(document, 'mousedown', { clientX: P[0], clientY: P[1] })
    listener.emit(document, 'mouseup', { clientX: P[2], clientY: P[3] })
    listener.emit(document, 'mousemove', { clientX: P[4], clientY: P[5] })
    listener.emit(document, 'click', { clientX: P[6], clientY: P[7] })
    listener.emit(document, 'keydown', { code: 'KeyA', altKey: true, ctrlKey: true, shiftKey: false, metaKey: false })
    listener.emit(document, 'keyup', { code: 'KeyB', altKey: false, ctrlKey: false, shiftKey: true, metaKey: true })

    service.enable()

    listener.emit(document, 'mousedown', { clientX: P[8], clientY: P[9] })
    listener.emit(document, 'mouseup', { clientX: P[10], clientY: P[11] })
    listener.emit(document, 'mousemove', { clientX: P[12], clientY: P[13] })
    listener.emit(document, 'click', { clientX: P[14], clientY: P[15] })
    listener.emit(document, 'keydown', { code: 'Enter', altKey: true, ctrlKey: false, shiftKey: true, metaKey: false })
    listener.emit(document, 'keyup', { code: 'Esc', altKey: false, ctrlKey: true, shiftKey: false, metaKey: true })

    service.disable()

    listener.emit(document, 'mousedown', { clientX: P[16], clientY: P[17] })
    listener.emit(document, 'mouseup', { clientX: P[18], clientY: P[19] })
    listener.emit(document, 'mousemove', { clientX: P[20], clientY: P[21] })
    listener.emit(document, 'click', { clientX: P[22], clientY: P[23] })
    listener.emit(document, 'keydown', { code: 'KeyC', altKey: false, ctrlKey: false, shiftKey: true, metaKey: true })
    listener.emit(document, 'keyup', { code: 'KeyD', altKey: true, ctrlKey: true, shiftKey: false, metaKey: false })

    service.enable()

    config.stage = { scale: 2 }

    listener.emit(document, 'mousedown', { clientX: P[24], clientY: P[25] })
    listener.emit(document, 'mouseup', { clientX: P[26], clientY: P[27] })
    listener.emit(document, 'mousemove', { clientX: P[28], clientY: P[29] })
    listener.emit(document, 'click', { clientX: P[30], clientY: P[31] })

    ;($canvas as any).offsetLeft = P[100]
    ;($canvas as any).offsetTop = P[101]
    config.stage = { width: P[0], height: P[1], scale: 1 }

    listener.emit(document, 'mousedown', { clientX: P[32], clientY: P[33] })
    listener.emit(document, 'mouseup', { clientX: P[34], clientY: P[35] })
    listener.emit(document, 'mousemove', { clientX: P[36], clientY: P[37] })
    listener.emit(document, 'click', { clientX: P[38], clientY: P[39] })

    service.toggle()

    listener.emit(window, 'focus')
    listener.emit(window, 'blur')
    listener.emit(document, 'mousedown', { clientX: P[40], clientY: P[41] })
    listener.emit(document, 'mouseup', { clientX: P[42], clientY: P[43] })
    listener.emit(document, 'mousemove', { clientX: P[44], clientY: P[45] })
    listener.emit(document, 'click', { clientX: P[46], clientY: P[47] })

    service.toggle()

    listener.emit(window, 'focus')
    listener.emit(window, 'blur')

    expect(service.withdraw()).toEqual([
      ['MouseDown', { x: P[8] - P[0], y: P[9] - P[1] }],
      ['MouseUp', { x: P[10] - P[0], y: P[11] - P[1] }],
      ['MouseMove', { x: P[12] - P[0], y: P[13] - P[1] }],
      ['MouseClick', { x: P[14] - P[0], y: P[15] - P[1] }],
      ['KeyDown', { code: 'Enter', alt: true, ctrl: false, shift: true, meta: false }],
      ['KeyUp', { code: 'Esc', alt: false, ctrl: true, shift: false, meta: true }],

      ['MouseDown', { x: (P[24] - P[0]) / 2, y: (P[25] - P[1]) / 2 }],
      ['MouseUp', { x: (P[26] - P[0]) / 2, y: (P[27] - P[1]) / 2 }],
      ['MouseMove', { x: (P[28] - P[0]) / 2, y: (P[29] - P[1]) / 2 }],
      ['MouseClick', { x: (P[30] - P[0]) / 2, y: (P[31] - P[1]) / 2 }],

      ['MouseDown', { x: P[32] - P[100], y: P[33] - P[101] }],
      ['MouseUp', { x: P[34] - P[100], y: P[35] - P[101] }],
      // ['MouseMove', { x: P[36] - P[100], y: P[37] - P[101] }],
      ['MouseClick', { x: P[38] - P[100], y: P[39] - P[101] }],

      ['WindowFocus'],
      ['WindowBlur'],
    ])
  })
})
