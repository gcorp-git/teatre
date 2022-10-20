import { API } from './api'
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

export class Play {
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
  
      if (events.length) this.api.sendEventsUpdate(events)
    })
  }

  start(): void {
    if (this.status !== STATUS.STOPPED) return

    this.status = STATUS.STARTING

    this.api.onInitConfig(config => {
      this.config.update(config)

      this.state.$title.textContent = this.config.title

      window.addEventListener('resize', e => {
        const width = window.outerWidth
        const height = window.outerHeight
        
        this.api.sendWindowResize({ width, height })
      })

      this.api.onStageRender(buffer => (this.state.buffer = buffer))

      this.api.onStageUpdate(stage => {
        this.config.update({ stage })
        this.stage.update()
      })

      this.assets.load(this.config.assets).then(() => {
        this.api.sendInitLoaded({
          images: this.assets.getImagesInfo(this.assets.images)
        })
  
        this.controller.enable()
        this.clock.start()
  
        this.status = STATUS.WORKING
      })
    })

    this.api.sendInitReady()
  }

  stop(): void {
    if (this.status !== STATUS.WORKING) return

    this.status = STATUS.STOPPING

    this.clock.stop()
    this.api.unsubscribe()
    this.controller.destructor()

    this.status = STATUS.STOPPED
  }
}
