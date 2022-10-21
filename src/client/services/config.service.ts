import { deepFreeze, DeepPartial } from '../../utils/etc'

export interface IPlayConfig {
  title: IPlayConfigTitle
  stage: IPlayConfigStage
  assets: IPlayConfigAssets
}

export type IPlayConfigTitle = string

export interface IPlayConfigStage {
  width: number
  height: number
  scale: number
  smoothing: boolean
  cursor: string
}

export interface IPlayConfigAssets {
  images: string[]
}

export class ConfigService {
  private cache: IPlayConfig
  private config: IPlayConfig = {
    title: '',
    stage: {
      width: 800,
      height: 600,
      scale: 1,
      smoothing: false,
      cursor: 'default',
    },
    assets: {
      images: [],
    },
  }

  constructor() {
    this._cache()
  }

  get title(): IPlayConfigTitle {
    return this.cache.title
  }

  set title(value: IPlayConfigTitle) {
    if (value === undefined) return

    this._setTitle(value)
    this._cache()
  }

  get stage(): IPlayConfigStage {
    return this.cache.stage
  }

  set stage(value: Partial<IPlayConfigStage>) {
    if (value === undefined) return

    this._setStage(value)
    this._cache()
  }

  get assets(): IPlayConfigAssets {
    return this.cache.assets
  }

  set assets(value: Partial<IPlayConfigAssets>) {
    if (value === undefined) return

    this._setAssets(value)
    this._cache()
  }

  update(data: DeepPartial<IPlayConfig>): void {
    if (data === undefined) return

    if (data.title !== undefined) this._setTitle(data.title)
    if (data.stage !== undefined) this._setStage(data.stage)
    if (data.assets !== undefined) this._setAssets(data.assets)

    this._cache()
  }

  private _setTitle(title: IPlayConfigTitle): void {
    this.config.title = title
  }

  private _setStage(stage: Partial<IPlayConfigStage>): void {
    if (stage.width !== undefined) this.config.stage.width = stage.width
    if (stage.height !== undefined) this.config.stage.height = stage.height
    if (stage.scale !== undefined) this.config.stage.scale = stage.scale
    if (stage.smoothing !== undefined) this.config.stage.smoothing = stage.smoothing
    if (stage.cursor !== undefined) this.config.stage.cursor = stage.cursor
  }

  private _setAssets(assets: Partial<IPlayConfigAssets>): void {
    if (assets.images !== undefined) this.config.assets.images = assets.images
  }

  private _cache(): void {
    this.cache = deepFreeze(JSON.parse(JSON.stringify(this.config))) as IPlayConfig
  }
}
