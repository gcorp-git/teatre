import { DOMListener } from '../../utils/dom-listener'
import { ConfigService } from './config.service'

export class EventsService {
  private $canvas: HTMLCanvasElement
  private config: ConfigService
  private listener: DOMListener
  private enabled = false
  private queue: [event: string, payload: any][] = []

  constructor({ $canvas, config, listener }: {
    $canvas: HTMLCanvasElement
    config: ConfigService
    listener?: DOMListener
  }) {
    this.$canvas = $canvas
    this.config = config

    this.listener = listener ?? new DOMListener()

    this.listener.on(document, 'mousedown', onMouseDown.bind(this))
    this.listener.on(document, 'mouseup', onMouseUp.bind(this))
    this.listener.on(document, 'mousemove', onMouseMove.bind(this))
    this.listener.on(document, 'click', onClick.bind(this))
    this.listener.on(document, 'keydown', onKeyDown.bind(this))
    this.listener.on(document, 'keyup', onKeyUp.bind(this))
    
    this.listener.on(window, 'focus', onFocus.bind(this))
    this.listener.on(window, 'blur', onBlur.bind(this))
  }
  
  destructor(): void {
    this.enabled = false
    this.listener.clear()
  }

  enable(): void {
    this.enabled = true
  }

  disable(): void {
    this.enabled = false
  }

  toggle(): void {
    this.enabled = !this.enabled
  }

  withdraw(): [event: string, payload: any][] {
    const events = this.queue
    
    this.queue = []

    return events
  }
}

function onMouseDown(e: any): void {
  if (!this.enabled) return

  const offsetLeft = this.$canvas.offsetLeft
  const offsetTop = this.$canvas.offsetTop

  const x = (e.clientX - offsetLeft) / this.config.stage.scale
  const y = (e.clientY - offsetTop) / this.config.stage.scale

  this.queue.push(['MouseDown', { x, y }])
}

function onMouseUp(e: any): void {
  if (!this.enabled) return

  const offsetLeft = this.$canvas.offsetLeft
  const offsetTop = this.$canvas.offsetTop

  const x = (e.clientX - offsetLeft) / this.config.stage.scale
  const y = (e.clientY - offsetTop) / this.config.stage.scale

  this.queue.push(['MouseUp', { x, y }])
}

function onMouseMove(e: any): void {
  if (!this.enabled) return

  const offsetLeft = this.$canvas.offsetLeft
  const offsetTop = this.$canvas.offsetTop

  const x = (e.clientX - offsetLeft) / this.config.stage.scale
  const y = (e.clientY - offsetTop) / this.config.stage.scale

  if (x < 0) return
  if (y < 0) return
  if (x > this.config.stage.width) return
  if (y > this.config.stage.height) return

  this.queue.push(['MouseMove', { x, y }])
}

function onClick(e: any): void {
  if (!this.enabled) return

  const offsetLeft = this.$canvas.offsetLeft
  const offsetTop = this.$canvas.offsetTop

  const x = (e.clientX - offsetLeft) / this.config.stage.scale
  const y = (e.clientY - offsetTop) / this.config.stage.scale

  this.queue.push(['MouseClick', { x, y }])
}

function onKeyDown(e: any): void {
  if (!this.enabled) return

  const code = e.code
  const alt = e.altKey
  const ctrl = e.ctrlKey
  const shift = e.shiftKey
  const meta = e.metaKey

  this.queue.push(['KeyDown', { code, alt, ctrl, shift, meta }])
}

function onKeyUp(e: any): void {
  if (!this.enabled) return

  const code = e.code
  const alt = e.altKey
  const ctrl = e.ctrlKey
  const shift = e.shiftKey
  const meta = e.metaKey

  this.queue.push(['KeyUp', { code, alt, ctrl, shift, meta }])
}

function onFocus(e: any): void {
  if (!this.enabled) return

  this.queue.push(['WindowFocus'])
}

function onBlur(e: any): void {
  if (!this.enabled) return

  this.queue.push(['WindowBlur'])
}
