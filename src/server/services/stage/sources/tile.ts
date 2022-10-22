import { ISpriteSource } from '../sprite'
import { AssetsImage } from '../../assets/assets-image'
import { ImageBuilder } from '../render/image.builder'

export class TileSource implements ISpriteSource {
  image: AssetsImage
  dx: number
  dy: number
  width: number
  height: number

  constructor(args: {
    image: AssetsImage
    dx?: number
    dy?: number
    width?: number
    height?: number
  }) {
    this.image = args.image
    this.dx = args.dx ?? 0
    this.dy = args.dy ?? 0
    this.width = args.width ?? this.image?.width
    this.height = args.height ?? this.image?.height
  }
  
  render(): ImageBuilder {
    if (!this.image) return undefined

    return new ImageBuilder({
      data: this.image,
      src: [this.dx, this.dy, this.width, this.height],
    })
  }
}
