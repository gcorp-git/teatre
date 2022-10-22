import { Service } from '../decorators/service.decorator'

const TURBO = false

@Service()
export class ClockService {
  private started = false
  private startedAt: bigint
  private lastAt: bigint
  private _passed: number

  private static FRAME: (delta: number) => void

  constructor() {
    //
  }

  get passed(): number {
    return this._passed
  }
  
  start(): void {
    if (this.started) return

    this.started = true

    this.lastAt = BigInt(0)

    const frame = () => {
      if (!this.started) return

      const now = process.hrtime.bigint()
      
      if (!this.startedAt) this.startedAt = now

      const delta = this.lastAt ? 1e-9 * Number(now - this.lastAt) : 0
      
      this.lastAt = now
      this._passed = 1e-9 * Number(this.lastAt - this.startedAt)

      ClockService.FRAME(delta)

      TURBO ? setImmediate(frame) : setTimeout(frame, 0)
    }

    TURBO ? setImmediate(frame) : setTimeout(frame, 0)
  }

  stop(): void {
    if (!this.started) return

    this.started = false
    
    delete this.startedAt
    delete this.lastAt
    delete this._passed
  }
}
