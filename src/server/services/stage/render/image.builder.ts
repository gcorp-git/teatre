import { TYPE } from './model'
import { Builder } from './builder'
import { AssetsImage } from '../../assets/assets-image'

export class ImageBuilder extends Builder<AssetsImage> {
  protected _type = TYPE.IMAGE

  protected _serialize(): number {
    if (!this._data) return undefined

    return this._data.index
  }
}
