import { Loader } from './assets/loader'
import { ImageLoader } from './assets/image.loader'

export class AssetsService {
  transform = {
    image: (url: string) => `../../assets/images/${url}`
  }

  private imageLoader: Loader<HTMLImageElement>
  private _images: HTMLImageElement[] = []

  constructor({ imageLoader }: {
    imageLoader?: Loader<HTMLImageElement>
  } = {}) {
    this.imageLoader = imageLoader ?? new ImageLoader()
  }

  load(assets: {
    images: string[]
  }): Promise<HTMLImageElement[]> {
    return new Promise<HTMLImageElement[]>((resolve, reject) => {
      this.imageLoader
        .load(assets.images, this.transform.image)
        .then(images => {
          this._images = Object.freeze(images) as HTMLImageElement[]
          resolve(images)
        })
        .catch(reject)
    })
  }

  get images() {
    return this._images
  }

  getImagesInfo(images: HTMLImageElement[]): { width: number, height: number }[] {
    const total = images.length
    const info = new Array(total)

    for (let index = 0; index < total; index++) {
      info[index] = {
        width: images[index].width,
        height: images[index].height,
      }
    }

    return info
  }
}
