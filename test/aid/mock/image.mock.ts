export class ImageMock {
  onload: () => void
  onerror: () => void

  private _src: string
  private _width: number
  private _height: number

  get src() {
    return this._src
  }

  set src(value: string) {
    this._src = value

    setTimeout(() => {
      if (this._src.indexOf('error') >= 0) {
        this.onerror()
      } else {
        this._width = 0
        this._height = 0
        this.onload()
      }
    })
  }

  get width() {
    return this._width
  }

  get height() {
    return this._height
  }
}
