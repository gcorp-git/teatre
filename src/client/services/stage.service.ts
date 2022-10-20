import { ConfigService } from './config.service'

export class StageService {
  private $canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private config: ConfigService

  constructor({ $canvas, ctx, config }: {
    $canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    config: ConfigService
  }) {
    this.$canvas = $canvas
    this.ctx = ctx
    this.config = config
  }

  update(): void {
    const config = this.config.stage

    this.$canvas.width = config.scale * config.width
    this.$canvas.height = config.scale * config.height
  
    this.ctx.scale(config.scale, config.scale)

    this.ctx.imageSmoothingEnabled = config.smoothing
    
    this.$canvas.style.cursor = config.cursor
  }  
}
