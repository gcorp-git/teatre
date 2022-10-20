import { deepFreeze } from '../../utils/etc'
import { ConfigService } from '../services/config.service'
import { PROP } from './types'
import { IPlayClass, IPlay, IPlayConfig } from '../decorators/play.model'
import { InjectorService } from '../services/injector.service'
import { AssetsService } from '../services/assets.service'
import { ClockService } from '../services/clock.service'
import { EventsService } from '../services/events.service'
import { StageService } from '../services/stage.service'
import { Subscriptions } from '../../utils/subscriptions'

type Listener = (event: string, data: any) => void

interface IState {
  window: any,
  on: (channel: string, listener: Listener) => void
  off: (channel: string, listener: Listener) => void
  send: (channel: string, data: any) => void
  ready: () => void
}

export default class Root {
  private config: IPlayConfig
  private injector: InjectorService
  private assets: AssetsService
  private clock: ClockService
  private events: EventsService
  private stage: StageService
  private play: IPlay
  private state: IState
  private started = false
  private subs: Subscriptions

  constructor(PlayClass: IPlayClass, state: IState) {
    this.config = deepFreeze(PlayClass[PROP.CONFIG])

    ;(ConfigService as any).CONFIG = this.config
    ;(ClockService as any).FRAME = this.onFrame.bind(this)

    this.injector = new InjectorService()
    this.assets = this.injector.inject<AssetsService>(AssetsService)
    this.clock = this.injector.inject<ClockService>(ClockService)
    this.events = this.injector.inject<EventsService>(EventsService)
    this.stage = this.injector.inject<StageService>(StageService)

    this.state = state
    
    this.subs = new Subscriptions()

    this.subscribe('init:ready', (event, data) => {
      const config = this.config

      this.stage.width = config.stage?.width
      this.stage.height = config.stage?.height
      this.stage.scale = config.stage?.scale
      this.stage.smoothing = config.stage?.smoothing
      this.stage.cursor = config.stage?.cursor
      this.stage.updated = false

      this.state.send('init:config', config)
    })

    this.subscribe('init:loaded', (event, data) => {
      this.assets.init(data)
      this.play = this.injector.inject<IPlay>(PlayClass)
      this.start()
    })

    this.subscribe('window:resize', (event, data) => {
      // todo: handle on-window-resize event
    })

    this.subscribe('events:update', (event, data) => {
      for (const [event, payload] of data) {
        this.events.emit(event, payload)
      }
    })

    this.state.ready()
  }

  start(): void {
    if (this.started) return

    this.started = true

    this.clock.start()
  }

  stop(): void {
    if (!this.started) return

    this.started = false

    this.clock.stop()

    this.subs.events.forEach(event => {
      this.subs.each(event, subscriber => this.state.off(event, subscriber))
    })

    this.subs.clear()
  }

  onFrame(delta: number): void {
    if (this.stage.updated) this.onUpdate()

    if (this.play?.onFrame) this.play.onFrame(delta)

    this.state.send('stage:render', this.stage.camera.render().map(ri => ri.serialize()))
  }

  onUpdate(): void {
    this.stage.updated = false

    this.state.send('stage:update', {
      width: this.stage.width,
      height: this.stage.height,
      scale: this.stage.scale,
      smoothing: this.stage.smoothing,
      cursor: this.stage.cursor,
    })

    const width = this.stage.scale * this.stage.width
    const height = this.stage.scale * this.stage.height

    this.state.window.setSize(width, height)

    if (this.play?.onUpdate) this.play.onUpdate()
  }

  subscribe(event: string, subscriber: (...args: any[]) => void): void {
    this.subs.on(event, subscriber)
    this.state.on(event, subscriber)
  }
}
