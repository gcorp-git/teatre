import { IScene } from '../../decorators/scene.model'
import { Sprite } from './sprite'

export class SceneObject {
  x = 0
  y = 0
  z = 0
  width = 0
  height = 0
  hidden = false
  sprites = new Set<Sprite>()
  scene: IScene

  constructor(args: {
    x?: number
    y?: number
    z?: number
    width?: number
    height?: number
    hidden?: boolean
    sprites?: Sprite[] | Set<Sprite>
  } = {}) {
    this.x = args.x ?? 0
    this.y = args.y ?? 0
    this.z = args.z ?? 0
    this.width = args.width ?? 0
    this.height = args.height ?? 0
    this.hidden = args.hidden ?? false

    if (args.sprites) {
      for (const sprite of args.sprites) {
        this.sprites.add(sprite)
      }
    }
  }

	get center(): { x: number, y: number } {
		return {
			x: this.x + this.width / 2,
			y: this.y + this.height / 2,
		}
	}
  
	place(x: number, y: number, z: number, flagCenter = false): void {
    if (!flagCenter) {
      this.x = x ?? this.x
      this.y = y ?? this.y
      this.z = z ?? this.z
    } else {
      this.x = x !== undefined ? x - this.width / 2 : this.x
      this.y = y !== undefined ? y - this.height / 2 : this.y
      this.z = z ?? this.z
    }
	}

	move(dx=0, dy=0, dz=0): void {
		this.x += dx
		this.y += dy
		this.z += dz
	}

	resize(width: number, height: number): void {
		this.width = width ?? this.width
		this.height = height ?? this.height
	}

	in(x: number, y: number, width: number, height: number): boolean {
		if (this.x > x + width) return false
		if (this.x + this.width < x) return false
		if (this.y > y + height) return false
		if (this.y + this.height < y) return false

		return true
	}

	overlaps(o: SceneObject): boolean {
		const xOverlap = this.x < o.x + o.width && this.x + this.width > o.x
		const yOverlap = this.y < o.y + o.height && this.y + this.height > o.y

		return xOverlap && yOverlap
	}
}
