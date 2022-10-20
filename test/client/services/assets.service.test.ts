import { describe, expect, test } from '@jest/globals'
import { ImageLoaderMock } from '../../aid/mock/image-loader.mock'
import { AssetsService } from '../../../src/client/services/assets.service'

interface IAssets {
  images: string[]
}

const assets: IAssets = {
  images: ['', '1.png', 'readme.txt'],
}

describe(`AssetsService`, () => {
  test(`#0`, async () => {
    const mock = new ImageLoaderMock([])
    const service = new AssetsService({ imageLoader: mock })
    const loaded = await service.load(assets)
    expect([loaded, mock.urls, mock.transform]).toEqual([[], assets.images, service.transform.image])
  })
})
