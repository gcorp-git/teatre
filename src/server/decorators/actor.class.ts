import { IActor } from './actor.model';
import { IScenario } from './scenario.model';

export class ActorClass implements IActor {
  private _isEnabled = false
  private _scenario: IScenario

  get scene() {
    return this._scenario.scene
  }

  init(scenario: IScenario): void {
    this._scenario = scenario

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