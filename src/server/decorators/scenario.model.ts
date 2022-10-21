import { IService } from './service.model'
import { IScene } from './scene.model'

export interface IScenarioClass {
  new(...args: IService[]): IScenario
}

export interface IScenario {
  scene: IScene

  init(): void
  enable(data: any): void
  disable(): void
  frame(delta: number): void
  update(): void
  destroy(): void
  
  onInit(): void
  onEnable(data: any): void
  onDisable(): void
  onFrame(delta: number): void
  onUpdate(): void
  onDestroy(): void
}
