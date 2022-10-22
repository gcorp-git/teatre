import { Service } from '../decorators/service.decorator'
import { Camera } from './stage/camera'

@Service({
  static: true,
})
export class StageService {
  updated = false

  readonly camera: Camera

  private config = {
    width: 0,
    height: 0,
    scale: 1,
    smoothing: false,
    cursor: 'default',
  }

  constructor() {
    this.camera = new Camera({
      width: this.config.width,
      height: this.config.height,
    })
  }

  get width() {
    return this.config.width
  }

  set width(value) {
    if (value === undefined) return

    this.config.width = value
    this.camera.width = value
    this.updated = true
  }

  get height() {
    return this.config.height
  }

  set height(value) {
    if (value === undefined) return

    this.config.height = value
    this.camera.height = value
    this.updated = true
  }

  get scale() {
    return this.config.scale
  }

  set scale(value) {
    if (value === undefined) return

    this.config.scale = value
    this.updated = true
  }

  get smoothing() {
    return this.config.smoothing
  }

  set smoothing(value) {
    if (value === undefined) return

    this.config.smoothing = value
    this.updated = true
  }

  get cursor() {
    return this.config.cursor
  }

  set cursor(value) {
    if (value === undefined) return

    this.config.cursor = value
    this.updated = true
  }
}
