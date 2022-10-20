import { Loader } from '../../../src/client/services/assets/loader'

export class ImageLoaderMock extends Loader<HTMLImageElement> {
  urls: string[]
  transform: (url: string) => string
  constructor(
    private resolveData?: HTMLImageElement[],
    private rejectData?: string[],
  ) {
    super()
  }
  load(urls: string[], transform: (url: string) => string): Promise<HTMLImageElement[]> {
    this.urls = urls
    this.transform = transform
    return new Promise<HTMLImageElement[]>((resolve, reject) => {
      if (this.resolveData) resolve(this.resolveData)
      reject(this.rejectData)
    })
  }
}
