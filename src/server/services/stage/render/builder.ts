import { filterKeys } from '../../../../utils/etc'
import { IDest, IFilters, IItem, ISrc, TYPE } from './model'

const ALLOWED_FILTERS = ['filter', 'operation', 'rotate', 'scale', 'skew']

export abstract class Builder<T> {
  protected _data: T
  protected _src: ISrc
  protected _dest: IDest
  protected _filters: IFilters
  protected _cache: IItem

  protected abstract _type: TYPE

  constructor({ data, src, dest, filters }: {
    data?: T
    src?: ISrc
    dest?: ISrc
    filters?: IFilters
  } = {}) {
    if (data) this.data = data
    if (src) this.src = src
    if (dest) this.dest = dest
    if (filters) this.filters = filters
  }

  set data(value: T) {
    if (value) {
      this._cache = undefined
      this._data = value
    } else {
      if (!this._data) return
      this._cache = undefined
      this._data = undefined
    }
  }

  set src(value: ISrc) {
    if (value) {
      this._cache = undefined
      this._src = value
    } else {
      if (!this._src) return
      this._cache = undefined
      this._src = undefined
    }
  }

  set dest(value: IDest) {
    if (value) {
      this._cache = undefined
      this._dest = value
    } else {
      if (!this._dest) return
      this._cache = undefined
      this._dest = undefined
    }
  }

  set filters(value: IFilters) {
    if (value) {
      this._cache = undefined
      this._filters = value
    } else {
      if (!this._filters) return
      this._cache = undefined
      this._filters = undefined
    }
  }

  serialize(): IItem {
    if (!this._cache) {
      const data = this._serialize()
      
      if (data) {
        this._cache = [
          this._type,
          data,
          this._src ?? 0,
          this._dest ?? 0,
        ]

        const filters: IFilters = filterKeys(this._filters, { include: ALLOWED_FILTERS })

        if (filters) this._cache[4] = filters
      }
    }

    return this._cache
  }

  protected abstract _serialize(): unknown
}
