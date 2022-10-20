export class ClockService {
  private started = false
  private startedAt: number
  private lastAt: number
  private _passed: number

  constructor(private onFrame: (delta: number) => void) {
    //
  }

  get passed(): number | undefined {
		if (!this.started) return undefined
    
    return this._passed
  }
  
	start(): void {
		if (this.started) return

		this.started = true

		this.lastAt = 0

    const frame = (timestamp: number) => {
      if (!this.started) return

      const now = performance.now()
      
      if (!this.startedAt) this.startedAt = now

      const delta = this.lastAt ? 1e-3 * (now - this.lastAt) : 0
      
      this.lastAt = now
      this._passed = 1e-3 * (this.lastAt - this.startedAt)

      this.onFrame(delta)

      window.requestAnimationFrame(frame)
    }

    window.requestAnimationFrame(frame)
	}

	stop(): void {
		if (!this.started) return

		this.started = false
    this.startedAt = 0
    this.lastAt = 0
    this._passed = 0
	}
}
