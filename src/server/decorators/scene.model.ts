import { Builder } from '../services/stage/render/builder'
import { SceneObject } from '../services/stage/scene-object'
import { IService } from './service.model'

export interface ISceneClass {
  new(...args: IService[]): IScene
}

export interface IScene {
  init(): void
  render(x: number, y: number, width: number, height: number): Builder<unknown>[]
  has(o: SceneObject): boolean
  add(o: SceneObject): void
  remove(o: SceneObject): void
  clear(): void
  destroy(): void
  
  onInit(): void
  onDestroy(): void
}
