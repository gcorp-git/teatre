import { ISpriteSource } from '../sprite'
import { DraftBuilder } from '../render/draft.builder'

export class DraftSource implements ISpriteSource {
  width: number
  height: number
  
  private buffer: [method: string | 0, args: any[]][] = []

  constructor(args: {
    width?: number
    height?: number
  }) {
    this.width = args.width ?? 0
    this.height = args.height ?? 0
  }
  
  render(): DraftBuilder {
    if (!this.buffer.length) return undefined

    return new DraftBuilder({
      data: this.buffer,
      src: [0, 0, this.width, this.height],
    })
  }

  // todo: improve Draft
  // maybe it's better to have unique instances in browser
  // which are connected with the server by id

  set fillStyle(value: string) {
    this.buffer.push([0, ['fillStyle', value]])
  }

  fillRect(x: number, y: number, width: number, height: number): void {
    this.buffer.push(['fillRect', [x, y, width, height]])
  }

  save(): void {
    this.buffer.push(['save', []])
  }

  restore(): void {
    this.buffer.push(['restore', []])
  }

  clearRect(x: number, y: number, width: number, height: number): void {
    if (x <= 0 && y <= 0 && width >= this.width && height >= this.height) {
      this.clear()
    } else {
      this.buffer.push(['clearRect', [x, y, width, height]])
    }
  }

  clear(): void {
    this.buffer = []
  }
}
