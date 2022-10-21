import { deepFreeze } from '../../utils/etc'
import { ConfigService } from '../services/config.service'
import { PROP } from './types'
import { IPlayClass, IPlay, IPlayConfig } from '../decorators/play.model'
import { InjectorService } from '../services/injector.service'
import { AssetsService } from '../services/assets.service'
import { ClockService } from '../services/clock.service'
import { EventsService } from '../services/events.service'
import { StageService } from '../services/stage.service'
import { API, IAPI, SYGNAL } from './api'

enum STATUS {
  STARTING,
  WORKING,
  STOPPING,
  STOPPED,
}

export default class Root {
  private status = STATUS.STOPPED
  private api: API
  private win: any
  private play: IPlay
  private config: IPlayConfig
  private injector: InjectorService
  private assets: AssetsService
  private clock: ClockService
  private events: EventsService
  private stage: StageService

  private _ready: (Root) => void
  private _createPlayInstance: () => IPlay

  constructor({ Play, ready, api, win }: {
    Play: IPlayClass
    ready: () => void
    api: IAPI
    win: any
  }) {
    this.config = deepFreeze(Play[PROP.CONFIG])

    ;(ConfigService as any).CONFIG = this.config
    ;(ClockService as any).FRAME = this.onFrame.bind(this)

    this.injector = new InjectorService()
    this.assets = this.injector.inject<AssetsService>(AssetsService)
    this.clock = this.injector.inject<ClockService>(ClockService)
    this.events = this.injector.inject<EventsService>(EventsService)
    this.stage = this.injector.inject<StageService>(StageService)

    this.api = new API(api)
    this.win = win
    this._ready = ready
    this._createPlayInstance = () => this.injector.inject<IPlay>(Play)
    
    this._ready(this)
  }

  start(): void {
    if (this.status !== STATUS.STOPPED) return

    this.status = STATUS.STARTING

    // todo: @fix - client and server exchange same assets again after .stop() -> .start() being called
    
    this.api.on(SYGNAL.INIT_READY, () => {
      const config = this.config

      this.stage.width = config.stage?.width
      this.stage.height = config.stage?.height
      this.stage.scale = config.stage?.scale
      this.stage.smoothing = config.stage?.smoothing
      this.stage.cursor = config.stage?.cursor
      this.stage.updated = false

      this.api.send(SYGNAL.INIT_CONFIG, config)
    })

    this.api.on(SYGNAL.INIT_LOADED, assets => {
      this.assets.init(assets)

      if (!this.play) this.play = this._createPlayInstance()

      this.clock.start()
    })

    this.api.on(SYGNAL.EVENTS_UPDATE, events => {
      for (const [event, payload] of events) {
        this.events.emit(event, payload)
      }
    })

    this.api.on(SYGNAL.WINDOW_RESIZE, () => {
      // todo: handle window-resize event
    })

    this.status = STATUS.WORKING
  }

  stop(): void {
    if (this.status !== STATUS.WORKING) return

    this.status = STATUS.STOPPING

    this.clock.stop()
    this.api.reset()

    this.status = STATUS.STOPPED
  }

  onFrame(delta: number): void {
    if (this.stage.updated) this.onUpdate()

    if (this.play?.onFrame) this.play.onFrame(delta)

    this.api.send(SYGNAL.STAGE_RENDER, this.stage.camera.render().map(ri => ri.serialize()))
  }

  onUpdate(): void {
    this.stage.updated = false

    this.api.send(SYGNAL.STAGE_UPDATE, {
      width: this.stage.width,
      height: this.stage.height,
      scale: this.stage.scale,
      smoothing: this.stage.smoothing,
      cursor: this.stage.cursor,
    })

    const width = this.stage.scale * this.stage.width
    const height = this.stage.scale * this.stage.height

    this.win.setSize(width, height)

    if (this.play?.onUpdate) this.play.onUpdate()
  }
}
