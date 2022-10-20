import { TYPE, IItem } from './model'
import { Builder } from './builder'

export class ScreenBuilder extends Builder<Builder<unknown>[]> {
  protected _type = TYPE.SCREEN

  protected _serialize(): IItem[] {
    if (!this._data) return undefined

    const data: IItem[] = []

    this._data.forEach(ri => {
      const dto: IItem = ri?.serialize()

      if (dto) data.push(dto)
    })

    if (!data.length) return undefined

    return data
  }
}
