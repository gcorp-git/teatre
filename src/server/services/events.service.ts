import { Service } from '../decorators/service.decorator'
import { Subscriptions } from '../../utils/subscriptions'

export enum MOUSE {
  DOWN = 'MouseDown',
  UP = 'MouseUp',
  MOVE = 'MouseMove',
  CLICK = 'MouseClick',
}

export enum KEY {
  DOWN = 'KeyDown',
  UP = 'KeyUp',
}

export enum WINDOW {
  FOCUS = 'WindowFocus',
  BLUR = 'WindowBlur',
}

@Service({
  static: true,
})
export class EventsService {
  private subs: Subscriptions

  constructor() {
    this.subs = new Subscriptions()
  }

  on(event: MOUSE.DOWN, listener: (payload: { x: number, y: number }) => void): void
  on(event: MOUSE.UP, listener: (payload: { x: number, y: number }) => void): void
  on(event: MOUSE.MOVE, listener: (payload: { x: number, y: number }) => void): void
  on(event: MOUSE.CLICK, listener: (payload: { x: number, y: number }) => void): void
  on(event: KEY.DOWN, listener: (payload: { code: string, alt: boolean, ctrl: boolean, shift: boolean, meta: boolean }) => void): void
  on(event: KEY.UP, listener: (payload: { code: string, alt: boolean, ctrl: boolean, shift: boolean, meta: boolean }) => void): void
  on(event: WINDOW.FOCUS, listener: () => void): void
  on(event: WINDOW.BLUR, listener: () => void): void
  on(event: MOUSE | KEY | WINDOW, listener: (payload: any) => void): void {
		this.subs.on(event, listener)
  }

  off(event: MOUSE.DOWN, listener: (payload: { x: number, y: number }) => void): void
  off(event: MOUSE.UP, listener: (payload: { x: number, y: number }) => void): void
  off(event: MOUSE.MOVE, listener: (payload: { x: number, y: number }) => void): void
  off(event: MOUSE.CLICK, listener: (payload: { x: number, y: number }) => void): void
  off(event: KEY.DOWN, listener: (payload: { code: string, alt: boolean, ctrl: boolean, shift: boolean, meta: boolean }) => void): void
  off(event: KEY.UP, listener: (payload: { code: string, alt: boolean, ctrl: boolean, shift: boolean, meta: boolean }) => void): void
  off(event: WINDOW.FOCUS, listener: () => void): void
  off(event: WINDOW.BLUR, listener: () => void): void
  off(event: MOUSE | KEY | WINDOW, listener: (payload: any) => void): void {
    this.subs.off(event, listener)
  }

  emit(event: MOUSE.DOWN, payload: { x: number, y: number }): void
  emit(event: MOUSE.UP, payload: { x: number, y: number }): void
  emit(event: MOUSE.MOVE, payload: { x: number, y: number }): void
  emit(event: MOUSE.CLICK, payload: { x: number, y: number }): void
  emit(event: KEY.DOWN, payload: { code: string, alt: boolean, ctrl: boolean, shift: boolean, meta: boolean }): void
  emit(event: KEY.UP, payload: { code: string, alt: boolean, ctrl: boolean, shift: boolean, meta: boolean }): void
  emit(event: WINDOW.FOCUS): void
  emit(event: WINDOW.BLUR): void
  emit(event: MOUSE | KEY | WINDOW, payload?: any): void {
    this.subs.emit(event, payload)
  }

  clear(): void
  clear(event: MOUSE.DOWN): void
  clear(event: MOUSE.UP): void
  clear(event: MOUSE.MOVE): void
  clear(event: MOUSE.CLICK): void
  clear(event: KEY.DOWN): void
  clear(event: KEY.UP): void
  clear(event: WINDOW.FOCUS): void
  clear(event: WINDOW.BLUR): void
  clear(event?: MOUSE | KEY | WINDOW): void {
    this.subs.clear(event)
  }
}
