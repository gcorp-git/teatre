import { ISpriteSource } from '../sprite'
import { Camera } from '../camera'
import { ScreenBuilder } from '../render/screen.builder'

export class ScreenSource implements ISpriteSource {
  camera: Camera
  width: number
  height: number

  constructor(args: {
    camera: Camera
    width?: number
    height?: number
  }) {
    this.camera = args.camera
    this.width = args.width ?? this.camera?.width
    this.height = args.height ?? this.camera?.height
  }
  
  render(): ScreenBuilder {
    if (!this.camera) return undefined

    return new ScreenBuilder({
      data: this.camera.render(),
      src: [0, 0, this.width, this.height],
    })
  }
}
