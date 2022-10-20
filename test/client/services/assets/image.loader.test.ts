import { describe, expect, test } from '@jest/globals'
import { ImageMock } from '../../../aid/mock/image.mock'
import { ImageLoader } from '../../../../src/client/services/assets/image.loader'

describe(`ImageLoader`, () => {
  test(`load([])`, () => {
    const loader = new ImageLoader(ImageMock)
    const urls: string[] = []
    const transform = (url: string) => `<<<${url}>>>`
    expect(loader.load(urls, transform)).resolves.toEqual([])
  })
  test(`load(['1.png'])`, async () => {
    const loader = new ImageLoader(ImageMock)
    const urls: string[] = ['1.png']
    const transform = (url: string) => `<<<${url}>>>`
    const loaded = await loader.load(urls, transform)
    const data = loaded.map(image => ({
      src: image.src,
      width: image.width,
      height: image.height,
    }))
    expect(data).toEqual([{
      src: '<<<1.png>>>',
      width: 0,
      height: 0,
    }])
  })
  test(`load(['error.png'])`, async () => {
    const loader = new ImageLoader(ImageMock)
    const urls: string[] = ['error.png']
    const transform = (url: string) => `<<<${url}>>>`
    expect(loader.load(urls, transform)).rejects.toEqual(['<<<error.png>>>'])
  })
  test(`load(['1.png', '2.png', 'error-1.png', 'error-2.png'])`, async () => {
    const loader = new ImageLoader(ImageMock)
    const urls: string[] = ['1.png', '2.png', 'error-1.png', 'error-2.png']
    const transform = (url: string) => url
    expect(loader.load(urls, transform)).rejects.toEqual(['error-1.png', 'error-2.png'])
  })
})
