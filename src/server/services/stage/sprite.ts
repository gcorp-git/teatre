import { IFilters } from './render/model'
import { Builder } from './render/builder'

export interface ISpriteSource {
  width: number
  height: number
  render: () => Builder<unknown>
}

export class Sprite {
  source: ISpriteSource
  x = 0
  y = 0
  z = 0
  hidden = false

  private filters: IFilters = {}

  constructor(source: ISpriteSource, x = 0, y = 0, z = 0, hidden = false) {
    this.source = source
    this.x = x
    this.y = y
    this.z = z
    this.hidden = hidden
  }

  get width() {
    // todo: when calculating, take into account the influence of filters
    return this.source?.width
  }

  get height() {
    // todo: when calculating, take into account the influence of filters
    return this.source?.height
  }

  get hasFilters(): boolean {
    return Object.keys(this.filters).length > 0
  }

	set filter(value: string) {
    if (value !== undefined) {
      this.filters.filter = value
    } else {
      delete this.filters.filter
    }
	}

	set operation(value: string) {
    if (value !== undefined) {
      this.filters.operation = value
    } else {
      delete this.filters.operation
    }
	}

	set rotate(value: number) {
    if (value !== undefined) {
      this.filters.rotate = value
    } else {
      delete this.filters.rotate
    }
	}

	set scale(value: { x: number, y: number }) {
    if (value !== undefined) {
      this.filters.scale = value
    } else {
      delete this.filters.scale
    }
	}

	set skew(value: { x: number, y: number }) {
    if (value !== undefined) {
      this.filters.skew = value
    } else {
      delete this.filters.skew
    }
	}

  render(x: number, y: number): Builder<unknown> {
    const ri = this.source?.render()

    if (!ri) return undefined

    ri.dest = [x, y, this.width, this.height]
    
    if (this.hasFilters) ri.filters = this.filters

    return ri
  }
}
