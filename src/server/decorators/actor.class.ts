import { SceneObject } from '../services/stage/scene-object';
import { IActor } from './actor.model';
import { IScenario } from './scenario.model';

export class ActorClass implements IActor {
  private _isInited = false
  private _isEnabled = false
  private _scenario: IScenario
  private _object: SceneObject

  get object(): SceneObject {
    return this._object
  }

  set object(object: SceneObject) {
    if (this._object) return
    if (this._isInited) return

    this._object = object
  }

  init(scenario: IScenario): void {
    this._isInited = true
    this._scenario = scenario

    this.onInit(scenario)
  }

  enable(): void {
    if (this._isEnabled) return

    this._isEnabled = true

    if (this._object) this._scenario.scene.add(this._object)

    this.onEnable()
  }

  disable(): void {
    if (!this._isEnabled) return

    this._isEnabled = false

    if (this._object) this._scenario.scene.remove(this._object)

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

    this._isInited = false

    this.onDestroy()
  }

  onInit(scenario: IScenario): void {}
  onEnable(): void {}
  onDisable(): void {}
  onFrame(delta: number): void {}
  onUpdate(): void {}
  onDestroy(): void {}
}
