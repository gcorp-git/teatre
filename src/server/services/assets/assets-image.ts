export class AssetsImage {
  readonly index: number
  readonly path: string
  readonly width: number
  readonly height: number

  constructor(
    index: number,
    path: string,
    width: number,
    height: number,
  ) {
    this.index = index
    this.path = path
    this.width = width
    this.height = height
  }
}
