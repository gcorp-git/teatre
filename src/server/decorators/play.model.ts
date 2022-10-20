import { IService } from './service.model'

export type IPlayConfigTitle = string

export interface IPlayConfigStage {
  width?: number
  height?: number
  scale?: number
  smoothing?: boolean
  cursor?: string
}

export interface IPlayConfigAssets {
  images?: string[]
}

export interface IPlayConfig {
  title?: IPlayConfigTitle
  stage?: IPlayConfigStage
  assets?: IPlayConfigAssets
}

export interface IPlayClass {
  new(...args: IService[]): IPlay
}

export type IPlay = object & {
  onFrame?: (delta: number) => void
  onUpdate?: () => void
}
