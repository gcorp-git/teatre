import { IDirector } from './director.model';
import { IScenario } from './scenario.model';

export class DirectorClass implements IDirector {
  private _isEnabled = false
  private _scenario: IScenario

  init(scenario: IScenario): void {
    this.onInit(scenario)
  }

  enable(): void {
    if (this._isEnabled) return

    this._isEnabled = true

    this.onEnable()
  }

  disable(): void {
    if (!this._isEnabled) return

    this._isEnabled = false

    this.onDisable()
  }

  frame(delta: number): void {
    if (!this._isEnabled) return

    this.onFrame(delta)
  }

  update(): void {
    if (!this._isEnabled) return

    this.onUpdate()
  }

  destroy(): void {
    this.disable()

    this.onDestroy()
  }

  onInit(scenario: IScenario): void {}
  onEnable(): void {}
  onDisable(): void {}
  onFrame(delta: number): void {}
  onUpdate(): void {}
  onDestroy(): void {}
}
