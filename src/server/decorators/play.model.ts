import { ScenariosService } from '../services/scenarios.service'
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
  scenarios: ScenariosService

  init(): void
  frame(delta: number): void
  update(): void
  destroy(): void

  onInit(): void
  onFrame(delta: number): void
  onUpdate(): void
  onDestroy(): void
}
