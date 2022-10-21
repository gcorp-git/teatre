import { API, SYGNAL } from './api'
import { ConfigService } from '../services/config.service'
import { StageService } from '../services/stage.service'
import { AssetsService } from '../services/assets.service'
import { ControllerService } from '../services/controller.service'
import { RendererService, IDraft, IItem } from '../services/renderer.service'
import { ClockService } from '../services/clock.service'

interface IPlayState {
  $title: HTMLTitleElement
  $canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  buffer: IItem[]
  draft: IDraft
}

enum STATUS {
  STARTING,
  WORKING,
  STOPPING,
  STOPPED,
}

export class Root {
  private status = STATUS.STOPPED
  private api: API
  private state: IPlayState = {
    $title: document.querySelector('title'),
    $canvas: undefined,
    ctx: undefined,
    buffer: [],
    draft: {
      $canvas: document.createElement('canvas'),
      ctx: undefined,
    },
  }
  private config: ConfigService
  private stage: StageService
  private assets: AssetsService
  private renderer: RendererService
  private controller: ControllerService
  private clock: ClockService

  constructor({ selector, api }: {
    selector: string
    api: API
  }) {
    this.api = api
    this.state.$canvas = document.querySelector(selector)
    this.state.ctx = this.state.$canvas.getContext('2d')
    this.state.draft.ctx = this.state.draft.$canvas.getContext('2d')
    this.config = new ConfigService()
    this.stage = new StageService({
      $canvas: this.state.$canvas,
      ctx: this.state.ctx,
      config: this.config,
    })
    this.assets = new AssetsService()
    this.renderer = new RendererService()
    this.controller = new ControllerService({
      $canvas: this.state.$canvas,
      config: this.config,
    })
    this.clock = new ClockService(delta => {
      this.renderer.render({
        ctx: this.state.ctx,
        width: this.state.$canvas.width,
        height: this.state.$canvas.height,
        buffer:this.state.buffer,
        images: this.assets.images,
        draft: this.state.draft,
      })
  
      const events = this.controller.withdraw()
  
      if (events.length) this.api.send(SYGNAL.EVENTS_UPDATE, events)
    })
  }

  start(): void {
    if (this.status !== STATUS.STOPPED) return

    this.status = STATUS.STARTING

    let unsubscribe = this.api.on(SYGNAL.INIT_CONFIG, config => {
      unsubscribe()

      this.config.update(config)

      this.state.$title.textContent = this.config.title

      window.addEventListener('resize', e => {
        const width = window.outerWidth
        const height = window.outerHeight
        
        this.api.send(SYGNAL.WINDOW_RESIZE, { width, height })
      })

      this.api.on(SYGNAL.STAGE_RENDER, buffer => (this.state.buffer = buffer))

      this.api.on(SYGNAL.STAGE_UPDATE, stage => {
        this.config.update({ stage })
        this.stage.update()
      })

      this.assets.load(this.config.assets).then(() => {
        this.api.send(SYGNAL.INIT_LOADED, {
          images: this.assets.getImagesInfo(this.assets.images)
        })
  
        this.controller.enable()
        this.clock.start()
  
        this.status = STATUS.WORKING
      })
    })

    this.api.send(SYGNAL.INIT_READY)
  }

  stop(): void {
    if (this.status !== STATUS.WORKING) return

    this.status = STATUS.STOPPING

    this.clock.stop()
    this.api.reset()
    this.controller.destructor()

    this.status = STATUS.STOPPED
  }
}
