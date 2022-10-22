import { IScene } from '../../decorators/scene.model'
import { Builder } from './render/builder'

interface IState {
  scene?: IScene
}

export class Camera {
  public width = 0
  public height = 0
  public x = 0
  public y = 0

  private state: IState = {}
  private isRendering = false
  private buffer = []

  constructor({ width, height }: {
    width: number
    height: number
  }) {
    this.width = width
    this.height = height
  }

  get center(): { x: number, y: number } {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    }
  }

  attach(scene: IScene): void {
    this.state.scene = scene
  }

  detach(): void {
    delete this.state.scene
  }

  place(x: number, y: number, flagCenter = false): void {
    if (!flagCenter) {
      this.x = x ?? this.x
      this.y = y ?? this.y
    } else {
      this.x = x !== undefined ? x - this.width / 2 : this.x
      this.y = y !== undefined ? y - this.height / 2 : this.y
    }
  }
  
  move(dx = 0, dy = 0): void {
    this.x += dx
    this.y += dy
  }
  
  resize(width: number, height: number): void {
    this.width = width ?? this.width
    this.height = height ?? this.height
  }

  render(): Builder<unknown>[] {
    if (this.isRendering) return this.buffer

    this.isRendering = true

    const buffer = this.state.scene
      ? this.state.scene.render(this.x, this.y, this.width, this.height)
      : []

    this.isRendering = false

    this.buffer = buffer

    return this.buffer
  }
}
