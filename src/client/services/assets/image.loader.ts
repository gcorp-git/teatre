import { Loader } from './loader'

export class ImageLoader extends Loader<HTMLImageElement> {
  constructor(private ImageConstructor?: new() => any) {
    super()

    if (!this.ImageConstructor) this.ImageConstructor = Image
  }

  load(urls: string[], transform?: (url: string) => string): Promise<HTMLImageElement[]> {
    return new Promise<HTMLImageElement[]>((resolve, reject) => {
      let total = urls.length

      if (!total) resolve([])

      const errors: string[] = []
  
      let done = 0

      const images: HTMLImageElement[] = new Array(total)

      const onEach = () => {
        done++

        if (done >= total) {
          if (!errors.length) {
            resolve(images)
          } else {
            reject(errors)
          }
        }
      }

      for (let index = 0; index < total; index++) {
        const src = transform ? transform(urls[index]) : urls[index]
        const image = new this.ImageConstructor() as HTMLImageElement

        image.src = src

        image.onload = function(){
          onEach()
        }

        image.onerror = function(){
          errors.push(src)
          onEach()
        }

        images[index] = image
      }
    })
  }
}
