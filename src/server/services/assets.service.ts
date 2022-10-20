import { Service } from '../decorators/service.decorator'
import { ConfigService } from './config.service'
import { AssetsImage } from './assets/assets-image'

interface IImage {
  width: number
  height: number
}

interface IInitData {
  images: IImage[]
}

type IImagesByIndex = AssetsImage[]
type IImagesByPath = { [path: string]: AssetsImage }

@Service({
  static: true,
})
export class AssetsService {
  private isInited = false
  private imagesByIndex: IImagesByIndex = []
  private imagesByPath: IImagesByPath = {}

  constructor(private config: ConfigService) {
    //
  }

  init(data: IInitData) {
    if (this.isInited) return

    this.isInited = true

    for (let index = 0, len = data.images.length; index < len; index++) {
      const path = this.config.assets.images[index]
      const width = data.images[index].width
      const height = data.images[index].height
      const image = new AssetsImage(index, path, width, height)

      this.imagesByIndex[index] = image
      this.imagesByPath[path] = image
    }
  }

  image(indexOrPath: number | string): AssetsImage {
    return typeof indexOrPath === 'number'
      ? this.imagesByIndex[indexOrPath]
      : this.imagesByPath[indexOrPath]
  }
}
