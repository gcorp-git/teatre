import { describe, expect, test } from '@jest/globals'
import P from '../../aid/prime-numbers'
import { DOMListener } from '../../../src/utils/dom-listener'

let logs: any[] = []

const window = {
  mock: true,
  addEventListener: (event: string, listener: (e: any) => void, options: any) => {
    logs.push(['window.addEventListener', event, listener, options])
  },
  removeEventListener: (event: string, listener: (e: any) => void, options: any) => {
    logs.push(['window.removeEventListener', event, listener, options])
  },
}
const document = {
  mock: true,
  addEventListener: (event: string, listener: (e: any) => void, options: any) => {
    logs.push(['document.addEventListener', event, listener, options])
  },
  removeEventListener: (event: string, listener: (e: any) => void, options: any) => {
    logs.push(['document.removeEventListener', event, listener, options])
  },
}

describe(`DOMListener`, () => {
  test(`#0`, () => {
    logs = []

    const listener = new DOMListener()
    const onWindowFocus_0 = (e: any) => logs.push(['window:focus:0', e])
    const onWindowFocus_1 = (e: any) => logs.push(['window:focus:1', e])
    const onWindowBlur_0 = (e: any) => logs.push(['window:blur:0', e])

    listener.emit(document, 'click', { foo: P[1] })
    listener.emit(window, 'focus', { foo: P[2] })
    listener.emit(window, 'focus', { foo: P[3] })
    listener.emit(window, 'blur', { foo: P[4] })
    listener.emit(window, 'blur', { foo: P[5] })

    listener.on(window, 'focus', onWindowFocus_0, { focus: 0 })
    listener.on(window, 'focus', onWindowFocus_1, { focus: 1 })
    listener.on(window, 'blur', onWindowBlur_0, { blur: 0 })

    listener.emit(document, 'click', { foo: P[6] })
    listener.emit(window, 'focus', { foo: P[7] })
    listener.emit(window, 'focus', { foo: P[8] })
    listener.emit(window, 'blur', { foo: P[9] })
    listener.emit(window, 'blur', { foo: P[10] })

    listener.off(window, 'focus', onWindowFocus_0, { focus: 0 })

    listener.emit(document, 'click', { foo: P[11] })
    listener.emit(window, 'focus', { foo: P[12] })
    listener.emit(window, 'focus', { foo: P[13] })
    listener.emit(window, 'blur', { foo: P[14] })
    listener.emit(window, 'blur', { foo: P[15] })

    listener.clear(window, 'focus')

    listener.emit(document, 'click', { foo: P[16] })
    listener.emit(window, 'focus', { foo: P[17] })
    listener.emit(window, 'focus', { foo: P[18] })
    listener.emit(window, 'blur', { foo: P[19] })
    listener.emit(window, 'blur', { foo: P[20] })

    listener.clear(document, 'click')

    listener.emit(document, 'click', { foo: P[21] })
    listener.emit(window, 'focus', { foo: P[22] })
    listener.emit(window, 'focus', { foo: P[23] })
    listener.emit(window, 'blur', { foo: P[24] })
    listener.emit(window, 'blur', { foo: P[25] })

    listener.clear()

    listener.emit(document, 'click', { foo: P[26] })
    listener.emit(window, 'focus', { foo: P[27] })
    listener.emit(window, 'focus', { foo: P[28] })
    listener.emit(window, 'blur', { foo: P[29] })
    listener.emit(window, 'blur', { foo: P[30] })

    expect(logs).toEqual([
      ['window.addEventListener', 'focus', onWindowFocus_0, { focus: 0 }],
      ['window.addEventListener', 'focus', onWindowFocus_1, { focus: 1 }],
      ['window.addEventListener', 'blur', onWindowBlur_0, { blur: 0 }],
      ['window:focus:0', { foo: P[7] }],
      ['window:focus:1', { foo: P[7] }],
      ['window:focus:0', { foo: P[8] }],
      ['window:focus:1', { foo: P[8] }],
      ['window:blur:0', { foo: P[9] }],
      ['window:blur:0', { foo: P[10] }],
      ['window.removeEventListener', 'focus', onWindowFocus_0, { focus: 0 }],
      ['window:focus:1', { foo: P[12] }],
      ['window:focus:1', { foo: P[13] }],
      ['window:blur:0', { foo: P[14] }],
      ['window:blur:0', { foo: P[15] }],
      ['window.removeEventListener', 'focus', onWindowFocus_1, { focus: 1 }],
      ['window:blur:0', { foo: P[19] }],
      ['window:blur:0', { foo: P[20] }],
      ['window:blur:0', { foo: P[24] }],
      ['window:blur:0', { foo: P[25] }],
      ['window.removeEventListener', 'blur', onWindowBlur_0, { blur: 0 }],
    ])
  })
})

describe(`DOMListener (capture)`, () => {
  test(`#0`, () => {
    logs = []

    const listener = new DOMListener()
    const onWindowFocus = (e: any) => logs.push(['window:focus', e])

    listener.on(window, 'focus', onWindowFocus, { capture: true })
    listener.on(window, 'focus', onWindowFocus, { capture: false })
    listener.on(window, 'focus', onWindowFocus, true)
    listener.on(window, 'focus', onWindowFocus, false)

    listener.emit(window, 'focus', { foo: P[0] })

    listener.off(window, 'focus', onWindowFocus, { capture: true })

    listener.emit(window, 'focus', { foo: P[1] })

    expect(logs).toEqual([
      ['window.addEventListener', 'focus', onWindowFocus, { capture: true }],
      ['window.addEventListener', 'focus', onWindowFocus, { capture: false }],
      ['window.addEventListener', 'focus', onWindowFocus, true],
      ['window.addEventListener', 'focus', onWindowFocus, false],
      ['window:focus', { foo: P[0] }],
      ['window.removeEventListener', 'focus', onWindowFocus, { capture: true }],
    ])
  })
})
