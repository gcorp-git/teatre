import { IMole } from '../../utils/mole.model';
import { SceneObject } from '../services/stage/scene-object';
import { IActor } from './actor.model';
import { IScenario } from './scenario.model';

export class ActorClass implements IActor, IMole {
  private _isInited = false
  private _isEnabled = false
  private _scenario: IScenario
  private _object: SceneObject
  private _spies = new Map<(method: string, ...args: any) => void, () => void>()

  get object(): SceneObject {
    return this._object
  }

  set object(object: SceneObject) {
    if (this._isInited) return
    if (this._object) return

    this._object = object
  }

  init(scenario: IScenario): void {
    if (this._isInited) return

    this._isInited = true
    this._scenario = scenario

    if (this._spies.size) this._leak('init', scenario)

    this.onInit(scenario)
  }

  enable(): void {
    if (this._isEnabled) return

    this._isEnabled = true

    if (this._object) this._scenario.scene.add(this._object)

    if (this._spies.size) this._leak('enable')
    
    this.onEnable()
  }

  disable(): void {
    if (!this._isEnabled) return

    this._isEnabled = false

    if (this._object) this._scenario.scene.remove(this._object)

    if (this._spies.size) this._leak('disable')

    this.onDisable()
  }

  frame(delta: number): void {
    if (!this._isEnabled) return

    if (this._spies.size) this._leak('frame', delta)

    this.onFrame(delta)
  }

  update(): void {
    if (!this._isEnabled) return

    if (this._spies.size) this._leak('update')

    this.onUpdate()
  }

  destroy(): void {
    if (!this._isInited) return

    this._isInited = false

    this.disable()

    if (this._spies.size) this._leak('destroy')

    this.onDestroy()
  }

  spy(agent: (method: string, ...args: any) => void): () => void {
    let off = this._spies.get(agent)

    if (off) return off

    off = () => this._spies.delete(agent)

    this._spies.set(agent, off)

    return off
  }

  onInit(scenario: IScenario): void {}
  onEnable(): void {}
  onDisable(): void {}
  onFrame(delta: number): void {}
  onUpdate(): void {}
  onDestroy(): void {}

  private _leak(method: string, ...args: any): void {
    for (const [agent, off] of this._spies) {
      agent(method, ...args)
    }
  }
}
