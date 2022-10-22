import { IService } from './service.model'
import { IScenario } from './scenario.model'

export interface IDirectorClass {
  new(...args: IService[]): IDirector
}

export interface IDirector {
  init(scenario: IScenario): void
  enable(): void
  disable(): void
  frame(delta: number): void
  update(): void
  destroy(): void
  
  onInit(scenario: IScenario): void
  onEnable(): void
  onDisable(): void
  onFrame(delta: number): void
  onUpdate(): void
  onDestroy(): void
}
