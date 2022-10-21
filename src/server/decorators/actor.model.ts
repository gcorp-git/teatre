import { IService } from './service.model'
import { IScenario } from './scenario.model'
import { IScene } from './scene.model'

export interface IActorClass {
  new(...args: IService[]): IActor
}

export interface IActor {
  scenario: IScenario
  scene: IScene

  init(scenario: IScenario): void
  enable(): void
  disable(): void
  frame(delta: number): void
  update(): void
  destroy(): void
  
  onInit(): void
  onEnable(): void
  onDisable(): void
  onFrame(delta: number): void
  onUpdate(): void
  onDestroy(): void
}
