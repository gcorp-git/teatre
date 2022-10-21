import { IService } from './service.model'
import { IScenario } from './scenario.model'
import { IScene } from './scene.model'

export interface IActorClass {
  new(...args: IService[]): IActor
}

export interface IActor {
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
