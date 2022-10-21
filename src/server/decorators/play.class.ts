import { IPlay } from './play.model';
import { Meta, PROP } from '../core/meta';
import { ScenariosService } from '../services/scenarios.service';

export class PlayClass implements IPlay {
  private _scenarios: ScenariosService

  constructor() {
    const config = Meta.get(this.constructor as any, PROP.CONFIG)
    const injector = Meta.get(this.constructor as any, PROP.INJECTOR)
    
    this._scenarios = injector.inject(ScenariosService)
  }

  get scenarios() {
    return this._scenarios
  }

  init(): void {
    this.onInit()
  }
  
  frame(delta: number): void {
    this._scenarios.current?.frame(delta)

    this.onFrame(delta)
  }
  
  update(): void {
    this.onUpdate()
  }
  
  destroy(): void {
    this._scenarios.reset()

    this.onDestroy()
  }

  onInit(): void {}
  onFrame(delta: number): void {}
  onUpdate(): void {}
  onDestroy(): void {}
}
