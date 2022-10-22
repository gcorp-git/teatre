import { ClockService } from '../clock.service'

export class StageAnimation<T = unknown> {
  private clock: ClockService
  private duration: number
  private frames: T[]
  private startedAt: number
  private pausedAt: number
  private _isPaused = false
  
  constructor({ clock, duration, frames }: {
    clock: ClockService
    duration: number
    frames: T[]
  }) {
    this.clock = clock
    this.duration = duration
    this.frames = frames
  }

  get isPaused() {
    return this._isPaused
  }

  get progress() {
    if (this.startedAt === undefined) return 0

    const time = !this._isPaused
      ? this.clock.passed - this.startedAt
      : this.pausedAt - this.startedAt

    const ratio = time / this.duration
    
    return ratio - Math.floor(ratio)
  }

  get current() {
    if (this.startedAt === undefined && !this._isPaused) {
      this.startedAt = this.clock.passed
    }

    const current = Math.floor(this.progress * this.frames.length)

    return this.frames[current]
  }

  play(): void {
    if (this.startedAt === undefined) {
      this.startedAt = this.clock.passed
    } else {
      if (this._isPaused) {
        this.startedAt += this.clock.passed - this.pausedAt
      }
    }

    this.pausedAt = undefined
    this._isPaused = false
  }

  pause(): void {
    if (this.startedAt === undefined) {
      this.startedAt = this.clock.passed
    }

    this.pausedAt = this.clock.passed
    this._isPaused = true
  }

  toggle(): void {
    this._isPaused ? this.play() : this.pause()
  }
}
