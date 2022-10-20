import { IService } from './service.model'

export interface IScenarioClass {
  new(...args: IService[]): IScenario
}

export interface IScenario {
  onInit?(): void
  onEnable?(data: any): void
  onDisable?(): void
  onFrame?(delta: number): void
  onUpdate?(): void
  onDestroy?(): void
}
