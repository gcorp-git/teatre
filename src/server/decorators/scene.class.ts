import { IScene } from './scene.model'
import { Meta, PROP } from '../core/meta'
import { SceneObject } from '../services/stage/scene-object'
import { StageSpace } from '../services/stage/space'
import { Sprite } from '../services/stage/sprite'
import { Builder } from '../services/stage/render/builder'
import { IMole } from '../../utils/mole.model'

export class SceneClass implements IScene, IMole {
  private objects = new Set<SceneObject>()
  private options: {
    integerCoordinates?: boolean
  } = {}

  private _isInited = false
  private _spies = new Map<(method: string, ...args: any) => void, () => void>()

  constructor() {
    const config = Meta.get(this.constructor as any, PROP.CONFIG)

    this.options = { ...this.options, ...(config.options ?? {}) }
  }

  init(): void {
    if (this._isInited) return

    this._isInited = true
    
    if (this._spies.size) this._leak('init')

    this.onInit()
  }

  destroy(): void {
    if (!this._isInited) return

    this._isInited = false

    if (this._spies.size) this._leak('destroy')

    this.onDestroy()
  }

  has(o: SceneObject): boolean {
    return this.objects.has(o)
  }

  add(o: SceneObject): void {
    o.scene = this
    this.objects.add(o)
  }

  remove(o: SceneObject): void {
    if (this.objects.has(o)) {
      o.scene = undefined
      this.objects.delete(o)
    }
  }

  clear(): void {
    for (const o of this.objects) {
      o.scene = undefined
    }

    this.objects.clear()
  }

  render(x: number, y: number, width: number, height: number): Builder<unknown>[] {
    const space = new StageSpace<Sprite>()

    for (const o of this.objects) {
      if (o.hidden) continue

      for (const sprite of o.sprites) {
        if (sprite.hidden) continue

        const sx = o.x + sprite.x
        const sy = o.y + sprite.y
        const sz = o.z + sprite.z

        if (sx >= x + width) continue
        if (sx + sprite.width <= x) continue
        if (sy >= y + height) continue
        if (sy + sprite.height <= y) continue

        space.add(sx, sy, sz, sprite)
      }
    }

    const items: Builder<unknown>[] = []

    space.each((sx, sy, sz, sprite) => {
      const _x = this.options.integerCoordinates ? Math.round(sx - x) : sx - x
      const _y = this.options.integerCoordinates ? Math.round(sy - y) : sy - y

      const item: Builder<unknown> = sprite.render(_x, _y)

      if (item) items.push(item)
    })

    return items
  }

  spy(agent: (method: string, ...args: any) => void): () => void {
    let off = this._spies.get(agent)

    if (off) return off

    off = () => this._spies.delete(agent)

    this._spies.set(agent, off)

    return off
  }

  onInit(): void {}
  onDestroy(): void {}

  private _leak(method: string, ...args: any): void {
    for (const [agent, off] of this._spies) {
      agent(method, ...args)
    }
  }
}
