import { OrderedList } from './ordered-list'

const ERROR = {
  INCORRECT_SPACE_COORDINATES: 'INCORRECT_SPACE_COORDINATES',
}

interface IHolder<T> {
  x: number
  y: number
  z: number
  o: T
}

export class StageSpace<T = unknown> {
  private list = new OrderedList<OrderedList<OrderedList<Set<T>>>>()
  private map = new Map<T, IHolder<T>>()

  add(x: number, y: number, z: number, o: T): void {
    if (isNaN(x) || isNaN(y) || isNaN(z)) throw ERROR.INCORRECT_SPACE_COORDINATES

    this._getSetOrCreate(x, y, z).add(o)

    const holder = { x, y, z, o }

    this.map.set(o, holder)
  }

  remove(o: T): void {
    const holder = this.map.get(o)

    if (!holder) return

    this.map.delete(o)
    
    const { x, y, z } = holder

    const set = this._getSetIfExists(x, y, z)

    if (!set) return

    set.delete(o)

    // todo: should it delete empty containers?

    const layer = this.list.get(z)
    const row = layer.get(y)

    if (!set.size) row.remove(x)
    if (!row.size) layer.remove(y)
    if (!layer.size) this.list.remove(z)
  }

  clear(): void {
    this.list.each((z, layer) => {
      layer.each((y, row) => {
        row.each((x, set) => {
          set.forEach(o => this.map.delete(o))
        })
      })
    })

    this.list.clear()
  }

  each(f: (x: number, y: number, z: number, o: T) => void): void {
    this.list.each((z, layer) => {
      layer.each((y, row) => {
        row.each((x, set) => {
          set.forEach(o => f(x, y, z, o))
        })
      })
    })
  }

  private _getSetOrCreate(x: number, y: number, z: number): Set<T> {
    if (!this.list.has(z)) this.list.insert(z, new OrderedList<OrderedList<Set<T>>>())
    
    const layer = this.list.get(z)

    if (!layer.has(y)) layer.insert(y, new OrderedList<Set<T>>())

    const row = layer.get(y)

    if (!row.has(x)) row.insert(x, new Set<T>())

    return row.get(x)
  }

  private _getSetIfExists(x: number, y: number, z: number): Set<T> {
    if (!this.list.has(z)) return undefined
    
    const layer = this.list.get(z)

    if (!layer.has(y)) return undefined

    const row = layer.get(y)

    if (!row.has(x)) return undefined

    return row.get(x)
  }
}
