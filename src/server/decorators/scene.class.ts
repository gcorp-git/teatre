import { IScene } from './scene.model'
import { Meta, PROP } from '../core/meta'
import { SceneObject } from '../services/stage/scene-object'
import { StageSpace } from '../services/stage/space'
import { Sprite } from '../services/stage/sprite'
import { Builder } from '../services/stage/render/builder'

export class SceneClass implements IScene {
  private objects = new Set<SceneObject>()
  private options: {
    integerCoordinates?: boolean
  } = {}

  constructor() {
    const config = Meta.get(this.constructor as any, PROP.CONFIG)

    this.options = { ...this.options, ...(config.options ?? {}) }
  }

  init(): void {
    this.onInit()
  }

  destroy(): void {
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

  onInit(): void {}
  onDestroy(): void {}
}
