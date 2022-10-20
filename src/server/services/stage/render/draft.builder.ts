import { TYPE } from './model'
import { Builder } from './builder'

export class DraftBuilder extends Builder<[method: string | 0, args: any[]][]> {
  protected _type = TYPE.DRAFT

  protected _serialize(): [method: string | 0, args: any[]][] {
    if (!this._data) return undefined
    if (!this._data.length) return undefined

    return this._data
  }
}
