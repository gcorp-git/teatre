import { Builder } from '../services/stage/render/builder'
import { IService } from './service.model'

export interface ISceneClass {
  new(...args: IService[]): IScene
}

export interface IScene {
  render(x: number, y: number, width: number, height: number): Builder<unknown>[]
}
