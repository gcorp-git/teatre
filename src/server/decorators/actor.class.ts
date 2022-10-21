import { IActor } from './actor.model';
import { IScenario } from './scenario.model';

export class ActorClass implements IActor {
  private _scenario: IScenario

  private _isEnabled = true

  get scenario() {
    return this._scenario
  }

  get scene() {
    return this._scenario.scene
  }

  init(scenario: IScenario): void {
    this._scenario = scenario

    this.onInit()
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

  onInit(): void {}
  onEnable(): void {}
  onDisable(): void {}
  onFrame(delta: number): void {}
  onUpdate(): void {}
  onDestroy(): void {}
}
