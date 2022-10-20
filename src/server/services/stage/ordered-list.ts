const ERROR = {
	INCORRECT_ORDERED_LIST_WEIGHT: 'INCORRECT_ORDERED_LIST_WEIGHT',
}

export class OrderedList<T = unknown> {
  private map: { [weight: number]: T } = {}
  private isChanged = false
  private _weights: number[] = []
  private _values: T[] = []

  constructor() {
    //
  }

	get size() {
		return this._weights.length
	}

	get weights() {
		this._prepare()

		return this._weights
	}

	get values() {
		this._prepare()

		return this._values
	}

  insert(weight: number, value: T): void {
		if (isNaN(weight)) throw ERROR.INCORRECT_ORDERED_LIST_WEIGHT

		if (this._weights.indexOf(weight) === -1) {
			this._weights.push(weight)
		}

		this.map[weight] = value

		this.isChanged = true
	}

	has(weight: number): boolean {
		return this.map.hasOwnProperty(weight)
	}
  
	get(weight: number): T {
		return this.map[weight]
	}

	remove(weight: number): void {
		if (isNaN(weight)) throw ERROR.INCORRECT_ORDERED_LIST_WEIGHT

		const index = this._weights.indexOf(weight)
		const end = this._weights.length - 1

		if (index !== -1) {
			if (index !== end) {
				this._weights[index] = this._weights[end]
				this._weights.length--
			}

			delete this.map[weight]
		}

		this.isChanged = true
	}

	clear(): void {
		this.map = {}
		this.isChanged = false
		this._weights = []
		this._values = []
	}

	each(f: (weight: number, value: T) => void): void {
		this._prepare()

    for (const weight of this._weights) {
      f(weight, this.map[weight])
    }
	}

  _prepare(): void {
    if (!this.isChanged) return
  
    this._values = new Array(this._weights.length)
  
    const sorted = this._weights.sort((a, b) => a - b)
    
    for (let index = 0, len = sorted.length; index < len; index++) {
      this._values[index] = this.map[sorted[index]]
    }
    
    this.isChanged = false
  }
}
