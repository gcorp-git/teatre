import { StageAnimation } from '../animation'
import { ISpriteSource } from '../sprite'
import { Builder } from '../render/builder'

export class ClipSource implements ISpriteSource {
  animation: StageAnimation<ISpriteSource>
  width: number
  height: number

  constructor(args: {
    animation: StageAnimation<ISpriteSource>
    width?: number
    height?: number
  }) {
    this.animation = args.animation
    this.width = args.width ?? 0
    this.height = args.height ?? 0
  }
  
  render(): Builder<unknown> {
    if (!this.animation) return undefined

    return this.animation.current.render()
  }
}
