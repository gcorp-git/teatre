import { describe, expect, test } from '@jest/globals'
import { Subscriptions, ERROR } from '../../src/utils/subscriptions'

describe(`Subscriptions`, () => {
  const STATE = {
    subs: new Subscriptions(),
    listeners: [
      { event: 'click', listener: ({ n }) => (STATE.results[0] = n + 0) },
      { event: 'click', listener: ({ n }) => (STATE.results[1] = n + 1) },
      { event: 'focus', listener: ({ n }) => (STATE.results[2] = n + 2) },
    ],
    results: [0, 0, 0],
  }
  test(`empty`, () => {
    expect(STATE.subs.events).toEqual([])
  })
  test(`.on(undefined, ...)`, () => {
    expect(() => STATE.subs.on(undefined, () => 0)).toThrow(ERROR.INCORRECT_EVENT_NAME)
  })
  test(`.on('', ...)`, () => {
    expect(() => STATE.subs.on('', () => 0)).toThrow(ERROR.INCORRECT_EVENT_NAME)
  })
  test(`.on('click', ...) #0`, () => {
    STATE.subs.on(STATE.listeners[0].event, STATE.listeners[0].listener)
    expect(STATE.subs.events).toEqual(['click'])
  })
  test(`.on('click', ...) #1`, () => {
    STATE.subs.on(STATE.listeners[1].event, STATE.listeners[1].listener)
    expect(STATE.subs.events).toEqual(['click'])
  })
  test(`.on('focus', ...) #2`, () => {
    STATE.subs.on(STATE.listeners[2].event, STATE.listeners[2].listener)
    expect(STATE.subs.events).toEqual(['click', 'focus'])
  })
  test(`.off(undefined, ...)`, () => {
    expect(() => STATE.subs.off(undefined, () => 0)).toThrow(ERROR.INCORRECT_EVENT_NAME)
  })
  test(`.off('', ...)`, () => {
    expect(() => STATE.subs.off('', () => 0)).toThrow(ERROR.INCORRECT_EVENT_NAME)
  })
  test(`.off('click', ...) #0`, () => {
    STATE.subs.off(STATE.listeners[0].event, STATE.listeners[0].listener)
    expect(STATE.subs.events).toEqual(['click', 'focus'])
  })
  test(`.off('click', ...) #1`, () => {
    STATE.subs.off(STATE.listeners[1].event, STATE.listeners[1].listener)
    expect(STATE.subs.events).toEqual(['focus'])
  })
  test(`.off('focus', ...) #2`, () => {
    STATE.subs.off(STATE.listeners[2].event, STATE.listeners[2].listener)
    expect(STATE.subs.events).toEqual([])
  })
  test(`.clear('')`, () => {
    expect(() => STATE.subs.clear('')).toThrow(ERROR.INCORRECT_EVENT_NAME)
  })
  test(`.clear('click')`, () => {
    STATE.subs.on(STATE.listeners[0].event, STATE.listeners[0].listener)
    STATE.subs.on(STATE.listeners[1].event, STATE.listeners[1].listener)
    STATE.subs.on(STATE.listeners[2].event, STATE.listeners[2].listener)
    STATE.subs.clear('click')
    expect(STATE.subs.events).toEqual(['focus'])
  })
  test(`.clear('focus')`, () => {
    STATE.subs.on(STATE.listeners[0].event, STATE.listeners[0].listener)
    STATE.subs.on(STATE.listeners[1].event, STATE.listeners[1].listener)
    STATE.subs.on(STATE.listeners[2].event, STATE.listeners[2].listener)
    STATE.subs.clear('focus')
    expect(STATE.subs.events).toEqual(['click'])
  })
  test(`.clear('blur')`, () => {
    STATE.subs.on(STATE.listeners[0].event, STATE.listeners[0].listener)
    STATE.subs.on(STATE.listeners[1].event, STATE.listeners[1].listener)
    STATE.subs.on(STATE.listeners[2].event, STATE.listeners[2].listener)
    STATE.subs.clear('blur')
    expect(STATE.subs.events).toEqual(['click', 'focus'])
  })
  test(`.clear()`, () => {
    STATE.subs.on(STATE.listeners[0].event, STATE.listeners[0].listener)
    STATE.subs.on(STATE.listeners[1].event, STATE.listeners[1].listener)
    STATE.subs.on(STATE.listeners[2].event, STATE.listeners[2].listener)
    STATE.subs.clear()
    expect(STATE.subs.events).toEqual([])
  })
  test(`.emit(undefined, ...)`, () => {
    expect(() => STATE.subs.emit(undefined, 0)).toThrow(ERROR.INCORRECT_EVENT_NAME)
  })
  test(`.emit('', ...)`, () => {
    expect(() => STATE.subs.emit('', 0)).toThrow(ERROR.INCORRECT_EVENT_NAME)
  })
  test(`.emit('click', { n: 7 })`, () => {
    STATE.results = [0, 0, 0]
    STATE.subs.on(STATE.listeners[0].event, STATE.listeners[0].listener)
    STATE.subs.on(STATE.listeners[1].event, STATE.listeners[1].listener)
    STATE.subs.on(STATE.listeners[2].event, STATE.listeners[2].listener)
    STATE.subs.emit('click', { n: 7 })
    STATE.subs.clear()
    expect(STATE.results).toEqual([7, 8, 0])
  })
  test(`.emit('focus', { n: 7 })`, () => {
    STATE.results = [0, 0, 0]
    STATE.subs.on(STATE.listeners[0].event, STATE.listeners[0].listener)
    STATE.subs.on(STATE.listeners[1].event, STATE.listeners[1].listener)
    STATE.subs.on(STATE.listeners[2].event, STATE.listeners[2].listener)
    STATE.subs.emit('focus', { n: 7 })
    STATE.subs.clear()
    expect(STATE.results).toEqual([0, 0, 9])
  })
  test(`.emit('blur', { n: 7 })`, () => {
    STATE.results = [0, 0, 0]
    STATE.subs.on(STATE.listeners[0].event, STATE.listeners[0].listener)
    STATE.subs.on(STATE.listeners[1].event, STATE.listeners[1].listener)
    STATE.subs.on(STATE.listeners[2].event, STATE.listeners[2].listener)
    STATE.subs.emit('blur', { n: 7 })
    STATE.subs.clear()
    expect(STATE.results).toEqual([0, 0, 0])
  })
  test(`.each(undefined, ...)`, () => {
    expect(() => STATE.subs.each(undefined, () => 0)).toThrow(ERROR.INCORRECT_EVENT_NAME)
  })
  test(`.each('', ...)`, () => {
    expect(() => STATE.subs.each('', () => 0)).toThrow(ERROR.INCORRECT_EVENT_NAME)
  })
  test(`.each('click', ...)`, () => {
    STATE.subs.clear()
    STATE.subs.on(STATE.listeners[0].event, STATE.listeners[0].listener)
    STATE.subs.on(STATE.listeners[1].event, STATE.listeners[1].listener)
    STATE.subs.on(STATE.listeners[2].event, STATE.listeners[2].listener)
    const listeners = []
    STATE.subs.each('click', listener => listeners.push(listener))
    expect(listeners).toEqual([STATE.listeners[0].listener, STATE.listeners[1].listener])
  })
  test(`.each('focus', ...)`, () => {
    STATE.subs.clear()
    STATE.subs.on(STATE.listeners[0].event, STATE.listeners[0].listener)
    STATE.subs.on(STATE.listeners[1].event, STATE.listeners[1].listener)
    STATE.subs.on(STATE.listeners[2].event, STATE.listeners[2].listener)
    const listeners = []
    STATE.subs.each('focus', listener => listeners.push(listener))
    expect(listeners).toEqual([STATE.listeners[2].listener])
  })
  test(`.each('blur', ...)`, () => {
    STATE.subs.clear()
    STATE.subs.on(STATE.listeners[0].event, STATE.listeners[0].listener)
    STATE.subs.on(STATE.listeners[1].event, STATE.listeners[1].listener)
    STATE.subs.on(STATE.listeners[2].event, STATE.listeners[2].listener)
    const listeners = []
    STATE.subs.each('blur', listener => listeners.push(listener))
    expect(listeners).toEqual([])
  })
})
